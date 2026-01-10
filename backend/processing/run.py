from .cluster import cluster_facts

if __name__ == "__main__":
    print("Starting fact clustering process...")
    cluster_facts()
    print("Fact clustering process finished.")
