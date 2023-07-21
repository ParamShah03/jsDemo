class getDatabase {
    async getCouchs() {
        let couchs = await fetch("http://localhost:4000/upload/couchs");
        couchs = await couchs.json();

        return couchs;
    }
    async getChairs() {
        let chairs = await fetch("http://localhost:4000/upload/chairs");
        chairs = await chairs.json();

        return chairs;
    }
    async getFeatures() {
        var features = await fetch("http://localhost:4000/features");
        features = await features.json();

        return features;
    }
}
