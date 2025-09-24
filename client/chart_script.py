import plotly.graph_objects as go
import json

# Data from the provided JSON
data = {
    "components": ["Certificate Type", "Validity Status", "Completeness", "Farm Size", "Organic Practices"], 
    "weights": [40, 25, 20, 10, 5]
}

# Abbreviate component names to meet 15 character limit
abbreviated_components = ["Cert Type", "Validity Status", "Completeness", "Farm Size", "Organic Prac"]

# Primary brand colors
colors = ['#1FB8CD', '#DB4545', '#2E8B57', '#5D878F', '#D2BA4C']

# Create horizontal bar chart
fig = go.Figure(go.Bar(
    x=data["weights"],
    y=abbreviated_components,
    orientation='h',
    marker_color=colors,
    text=[f"{w}%" for w in data["weights"]],
    textposition='inside',
    textfont=dict(size=14, color='white')
))

# Update layout
fig.update_layout(
    title="Certificate Evaluation Scoring Weights",
    xaxis_title="Weight (%)",
    yaxis_title="Components"
)

# Update traces for better display
fig.update_traces(cliponaxis=False)

# Update x-axis to show percentage format
fig.update_xaxes(ticksuffix="%")

# Save as PNG and SVG
fig.write_image("certificate_weights.png")
fig.write_image("certificate_weights.svg", format="svg")

fig.show()