package Server;

import com.sun.net.httpserver.HttpServer;

import java.io.IOException;
import java.net.InetSocketAddress;
import java.util.ResourceBundle;

public class MyServer {
    private static final ResourceBundle SERVERBUNDLE = ResourceBundle.getBundle("Server");

    public static void init(final int port) {
        System.out.println("Starting Server on port " + port);

        //------    Configure server to run on selected port                ------------------------------------//
        HttpServer server;
        try {
            server = HttpServer.create(new InetSocketAddress(port), 0);
        } catch (IOException e) {
            System.err.println("Could not start server");
            throw new RuntimeException(e);
        }

        //------    Configure file handlers                                 ------------------------------------//
        server.createContext(SERVERBUNDLE.getString("path"), new Handler_ServeFile());
        server.createContext(SERVERBUNDLE.getString("path.api.test"), new Handler_Api_Test());
        server.createContext(SERVERBUNDLE.getString("path.api.query"), new Handler_Query());
        server.setExecutor(null); // creates a default executor

        //------    Start server                                            ------------------------------------//
        server.start();
        System.out.println("Server started");
    }
}
