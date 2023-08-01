class getDatabase {
    async getCouchs() {
        let couchs = await fetch("http://jsdemo.onrender.com/upload/couchs");
        couchs = await couchs.json();

        return couchs;
    }
    async getChairs() {
        let chairs = await fetch("http://jsdemo.onrender.com/upload/chairs");
        chairs = await chairs.json();

        return chairs;
    }
    async getFeatures() {
        var features = await fetch("http://jsdemo.onrender.com/features");
        features = await features.json();

        return features;
    }

    async getUsers() {
        var users = await fetch("http://jsdemo.onrender.com/users");
        users = await users.json();

        return users;
    }
}
