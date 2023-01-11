package Server;

import com.sun.net.httpserver.HttpServer;

import java.io.IOException;
import java.net.InetSocketAddress;

public class MyServer {
    static HttpServer server;

    public static void init(int port) {
        System.out.println("Starting Server on port " + port);

        //------    Configure server to run on selected port                ------------------------------------//
        try {
            server = HttpServer.create(new InetSocketAddress(port), 0);
        } catch (IOException e) {
            System.err.println("Could not start server");
            throw new RuntimeException(e);
        }

        //------    Configure file handlers                                 ------------------------------------//
        server.createContext("/", new Handler_Default());
        server.createContext("/api/test", new Handler_Api_Test());
        server.createContext("/api/query", new Handler_Query());
        server.setExecutor(null); // creates a default executor

        //------    Start server                                            ------------------------------------//
        server.start();
        System.out.println("Server started");
    }
}
