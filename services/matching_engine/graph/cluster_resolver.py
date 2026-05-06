"""Cluster resolver — connected components → UBID clusters.

Edges below the auto-merge threshold are excluded from clustering; they
remain as candidate pairs for the human reviewer.
"""
from __future__ import annotations
import networkx as nx
from .graph_builder import GraphBuilder


def resolve_clusters(builder: GraphBuilder, auto_merge_threshold: float) -> list[set[str]]:
    """Return the list of node-id sets that should share one UBID."""
    h = nx.Graph()
    h.add_nodes_from(builder.g.nodes)
    for a, b, data in builder.g.edges(data=True):
        if data.get("weight", 0.0) >= auto_merge_threshold:
            h.add_edge(a, b)
    return [c for c in nx.connected_components(h)]
