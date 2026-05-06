from services.matching_engine.graph.graph_builder import GraphBuilder, Edge
from services.matching_engine.graph.cluster_resolver import resolve_clusters
from services.matching_engine.graph.ubid_registry import UbidRegistry


def test_clustering_groups_only_above_threshold():
    g = GraphBuilder()
    for n in "abcd":
        g.add_record(n)
    g.add_edge(Edge("a", "b", 0.95, None))
    g.add_edge(Edge("b", "c", 0.70, None))   # below auto-merge
    g.add_edge(Edge("c", "d", 0.91, None))
    clusters = resolve_clusters(g, auto_merge_threshold=0.85)
    sizes = sorted(len(c) for c in clusters)
    assert sizes == [1, 2, 2] or sizes == [2, 2]  # tolerate nx ordering


def test_registry_merge_split():
    reg = UbidRegistry()
    u1 = reg.assign(["r1", "r2"])
    u2 = reg.assign(["r3"])
    reg.merge(u1, u2)
    assert reg.lookup("r3") == u1
    new = reg.split(u1, ["r3"])
    assert reg.lookup("r3") == new and new != u1
