import plotly.graph_objects as go
import plotly.io as pio

# Since mermaid service is unavailable, create a flowchart using plotly
fig = go.Figure()

# Define nodes and their positions
nodes = [
    {"name": "PDF Upload", "x": 0.5, "y": 0.95, "type": "start"},
    {"name": "OCR Text Extract", "x": 0.5, "y": 0.85, "type": "process"},
    {"name": "Text Valid?", "x": 0.5, "y": 0.75, "type": "decision"},
    {"name": "Error: Invalid", "x": 0.2, "y": 0.65, "type": "end"},
    {"name": "Feature Extract", "x": 0.5, "y": 0.65, "type": "process"},
    {"name": "Cert Type", "x": 0.3, "y": 0.55, "type": "process"},
    {"name": "Authority", "x": 0.5, "y": 0.55, "type": "process"},
    {"name": "Validity", "x": 0.7, "y": 0.55, "type": "process"},
    {"name": "Scoring Algo", "x": 0.5, "y": 0.45, "type": "process"},
    {"name": "Apply Weights", "x": 0.5, "y": 0.35, "type": "process"},
    {"name": "Calc Score", "x": 0.5, "y": 0.25, "type": "process"},
    {"name": "Score >= 80?", "x": 0.5, "y": 0.15, "type": "decision"},
    {"name": "Grade A", "x": 0.8, "y": 0.05, "type": "end"},
    {"name": "Score >= 60?", "x": 0.3, "y": 0.05, "type": "decision"},
    {"name": "Grade B", "x": 0.15, "y": -0.05, "type": "end"},
    {"name": "Grade C", "x": 0.45, "y": -0.05, "type": "end"}
]

# Add rectangles for process nodes
for node in nodes:
    if node["type"] == "process" or node["type"] == "start" or node["type"] == "end":
        fig.add_shape(
            type="rect",
            x0=node["x"]-0.08, y0=node["y"]-0.03,
            x1=node["x"]+0.08, y1=node["y"]+0.03,
            fillcolor="#1FB8CD" if node["type"] == "start" else "#2E8B57" if node["type"] == "end" else "#B3E5EC",
            line=dict(color="#13343B", width=2)
        )
    elif node["type"] == "decision":
        # Diamond shape for decisions (approximated with polygon)
        fig.add_shape(
            type="path",
            path=f"M {node['x']-0.08} {node['y']} L {node['x']} {node['y']+0.03} L {node['x']+0.08} {node['y']} L {node['x']} {node['y']-0.03} Z",
            fillcolor="#FFEB8A",
            line=dict(color="#13343B", width=2)
        )
    
    # Add text labels
    fig.add_annotation(
        x=node["x"], y=node["y"],
        text=node["name"],
        showarrow=False,
        font=dict(size=10, color="#13343B"),
        align="center"
    )

# Add arrows (connections)
connections = [
    (0, 1), (1, 2), (2, 3), (2, 4), (4, 5), (4, 6), (4, 7),
    (5, 8), (6, 8), (7, 8), (8, 9), (9, 10), (10, 11),
    (11, 12), (11, 13), (13, 14), (13, 15)
]

for start_idx, end_idx in connections:
    start = nodes[start_idx]
    end = nodes[end_idx]
    
    fig.add_annotation(
        x=end["x"], y=end["y"],
        ax=start["x"], ay=start["y"],
        xref="x", yref="y",
        axref="x", ayref="y",
        showarrow=True,
        arrowhead=2,
        arrowsize=1,
        arrowwidth=2,
        arrowcolor="#13343B"
    )

# Update layout
fig.update_layout(
    title="Certificate Validation Flow",
    xaxis=dict(showgrid=False, zeroline=False, showticklabels=False, range=[-0.1, 1.1]),
    yaxis=dict(showgrid=False, zeroline=False, showticklabels=False, range=[-0.15, 1.0]),
    showlegend=False,
    plot_bgcolor="white",
    height=800,
    width=1000
)

# Save the chart
fig.write_image("cert_validation.png")
fig.write_image("cert_validation.svg", format="svg")

print("Certificate validation flowchart created successfully")