"""Builds the entity-resolution graph in Neo4j (or a local NetworkX fallback
for tests). Each shadow record is a node; each scored pair above the review
threshold becomes a weighted edge."""
from __future__ import annotations
from dataclasses import dataclass
import networkx as nx


@dataclass
class Edge:
    a: str
    b: str
    score: float
    rule: str | None


class GraphBuilder:
    def __init__(self) -> None:
        self.g: nx.Graph = nx.Graph()

    def add_record(self, record_id: str, **attrs) -> None:
        self.g.add_node(record_id, **attrs)

    def add_edge(self, e: Edge) -> None:
        self.g.add_edge(e.a, e.b, weight=e.score, rule=e.rule)

    def to_dict(self) -> dict:
        return {
            "nodes": [{"id": n, **self.g.nodes[n]} for n in self.g.nodes],
            "edges": [{"a": a, "b": b, **self.g.edges[a, b]} for a, b in self.g.edges],
        }
