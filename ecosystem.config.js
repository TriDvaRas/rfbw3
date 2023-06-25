module.exports = {
    apps: [
        {
            name: "rfbw-next",
            script: "next",
            args: 'start -p 15532',
            env: {
                NODE_ENV: "production"
            },
            "log_date_format": "YYYY-MM-DD HH:mm:ss",
            "time": true,
            "autorestart": true,
            "max_memory_restart": "500M",
            "max_restarts": 5,
            "restart_delay": 10000,
            "min_uptime": 10000,
        },
        // {
        //     name: "rfbw-expess",
        //     script: "ts-node",
        //     args: 'src/server/extra/server.ts',
        //     env: {
        //         NODE_ENV: "production"
        //     }
        // },
    ]
}