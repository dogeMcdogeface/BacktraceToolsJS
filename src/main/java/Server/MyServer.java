package Server;

import com.sun.net.httpserver.HttpServer;

import java.io.IOException;
import java.net.InetSocketAddress;

public class MyServer {
    public static void init(int port) throws IOException {
        HttpServer server = HttpServer.create(new InetSocketAddress(port), 0);
        server.createContext("/", new Handler_File());
        server.createContext("/api/test", new Handler_Api_Test());
        server.setExecutor(null); // creates a default executor
        server.start();
    }
}
