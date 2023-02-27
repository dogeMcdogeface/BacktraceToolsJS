package Server;

import com.sun.net.httpserver.HttpServer;

import java.io.IOException;
import java.net.InetSocketAddress;
import java.util.ResourceBundle;

public class MyServer {
    private static final ResourceBundle MESSAGES = ResourceBundle.getBundle("Messages");
    private static final ResourceBundle SERVER = ResourceBundle.getBundle("Server");


    public static void init(int port) {
        System.out.println(MESSAGES.getString("console.starting.server") + port);
        //------    Configure server to run on selected port                ------------------------------------//
        HttpServer server;
        try {
            server = HttpServer.create(new InetSocketAddress(port), 0);
            //------    Configure file handlers                                 ------------------------------------//
            server.createContext(SERVER.getString("path"), new Handler_ServeFile());
            server.setExecutor(null); // creates a default executor
            //------    Start server                                            ------------------------------------//
            server.start();
            System.out.println(MESSAGES.getString("console.server.started"));
        } catch (IOException e) {
            System.err.println(MESSAGES.getString("console.server.not.started"));
            throw new RuntimeException(e);
        }
    }
}
