package Server;

import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;

import java.io.IOException;
import java.io.OutputStream;

public class Handler_Api_Test implements HttpHandler {
    @Override
    public void handle(HttpExchange t) throws IOException {
        String response = "{\"name\":\"John\", \"age\":30, \"car\":null}";
        t.sendResponseHeaders(200, response.length());
        OutputStream os = t.getResponseBody();
        os.write(response.getBytes());
        os.close();
    }
}
