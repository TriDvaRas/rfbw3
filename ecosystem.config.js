module.exports = {
    apps: [
        {
            name: "rfbw-next",
            script: "next",
            args: 'start -p 15532',
            env: {
                NODE_ENV: "production"
            },
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