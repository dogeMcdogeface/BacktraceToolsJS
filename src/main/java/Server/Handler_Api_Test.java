package Server;

import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;

import java.io.IOException;
import java.io.OutputStream;

//------    Serve a json response programmatically                  -----------------------------------//
public class Handler_Api_Test implements HttpHandler {
    @Override
    public void handle(HttpExchange t) throws IOException {
        final String response = "{\"name\":\"John\", \"age\":30, \"car\":null}";

        t.getResponseHeaders().set("Content-Type", "application/json");
        t.sendResponseHeaders(200, response.length());

        OutputStream os = t.getResponseBody();
        os.write(response.getBytes());
        os.close();
    }
}
