import sys
import json
from datetime import datetime, timedelta
from typing import List, Dict, Any

import numpy as np
import pandas as pd
from sklearn.linear_model import LinearRegression


def parse_sales_history(sales_history: List[Dict[str, Any]]) -> pd.DataFrame:
    """Parse sales history records [{date: 'YYYY-MM-DD', sold: number}] into a DataFrame.
    Assumes one record per day; aggregates by date if multiple.
    """
    if not isinstance(sales_history, list):
        raise ValueError('sales_history must be a list')
    rows = []
    for rec in sales_history:
        if not isinstance(rec, dict):
            continue
        date = rec.get('date')
        sold = rec.get('sold')
        if date is None or sold is None:
            continue
        try:
            d = pd.to_datetime(date).normalize()
            s = float(sold)
            if s < 0:
                s = 0.0
            rows.append((d, s))
        except Exception:
            continue
    if not rows:
        # generate a tiny default series (flat 1 unit/day) for robustness
        today = pd.Timestamp(datetime.now().date())
        rows = [(today - pd.Timedelta(days=i), 1.0) for i in range(14)][::-1]
    df = pd.DataFrame(rows, columns=['date', 'sold'])
    df = df.groupby('date', as_index=False)['sold'].sum().sort_values('date')
    return df


def forecast_sales(df: pd.DataFrame, days_ahead: int) -> List[float]:
    """Forecast daily sales for next N days with a simple Linear Regression on time index.
    Falls back to last-7-days mean if regression is degenerate.
    """
    # Create numeric time index
    df = df.copy()
    df['t'] = np.arange(len(df))
    X = df[['t']].values
    y = df['sold'].values

    preds = None
    try:
        if len(df) >= 3 and np.any(y > 0):
            model = LinearRegression()
            model.fit(X, y)
            t_future = np.arange(len(df), len(df) + days_ahead).reshape(-1, 1)
            pred = model.predict(t_future)
            # Clip to non-negative
            preds = np.clip(pred, 0.0, None).tolist()
    except Exception:
        preds = None

    if preds is None:
        # Fallback: moving average of last up to 7 days
        window = min(7, len(df))
        mean_val = float(np.maximum(0.0, df['sold'].tail(window).mean())) if window > 0 else 0.0
        preds = [mean_val for _ in range(days_ahead)]

    return preds


def predict_stock(payload: Dict[str, Any]) -> Dict[str, Any]:
    product = payload.get('product_name') or 'Product'
    current_stock = float(payload.get('current_stock', 0))
    days_ahead = int(payload.get('days_ahead', 30))
    sales_history = payload.get('sales_history', [])

    if days_ahead < 1 or days_ahead > 365:
        return {'success': False, 'error': 'days_ahead must be between 1 and 365'}

    df = parse_sales_history(sales_history)
    preds = forecast_sales(df, days_ahead)

    # Compute projected stock over horizon
    projected = []
    stock = current_stock
    stockout_date = None
    start_date = (df['date'].max() if not df.empty else pd.Timestamp(datetime.now().date())) + pd.Timedelta(days=1)

    for i, daily_sold in enumerate(preds):
        date_i = (start_date + pd.Timedelta(days=i)).date().isoformat()
        stock = float(max(0.0, stock - daily_sold))
        projected.append({'date': date_i, 'predicted_sold': float(daily_sold), 'projected_stock': stock})
        if stockout_date is None and stock <= 0.0:
            stockout_date = date_i

    summary = {
        'success': True,
        'product': product,
        'current_stock': current_stock,
        'days_ahead': days_ahead,
        'projected': projected,
        'stockout_date': stockout_date,
        'average_daily_sales_forecast': float(np.mean(preds)) if preds else 0.0
    }
    return summary


def main():
    if len(sys.argv) < 2:
        print(json.dumps({'success': False, 'error': 'No command provided'}))
        return
    command = sys.argv[1]
    try:
        if command == 'health':
            print(json.dumps({'success': True, 'status': 'healthy'}))
            return
        if command == 'predict':
            if len(sys.argv) < 3:
                print(json.dumps({'success': False, 'error': 'Missing payload'}))
                return
            try:
                payload = json.loads(sys.argv[2])
            except json.JSONDecodeError:
                print(json.dumps({'success': False, 'error': 'Invalid JSON payload'}))
                return
            result = predict_stock(payload)
            print(json.dumps(result))
            return
        print(json.dumps({'success': False, 'error': f'Unknown command: {command}'}))
    except Exception as e:
        print(json.dumps({'success': False, 'error': str(e)}))


if __name__ == '__main__':
    main()
