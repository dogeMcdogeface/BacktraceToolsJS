package Server;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;

import java.io.*;
import java.util.Map;

public class Handler_Query implements HttpHandler {
    @Override
    public void handle(HttpExchange t) throws IOException {
        //String response = "{\"name\":\"John\", \"age\":30, \"car2\":null}";
        String response = parseRequestBody(t);


        System.out.println(response);


        t.sendResponseHeaders(200, response.length());
        OutputStream os = t.getResponseBody();
        os.write(response.getBytes());
        os.close();
    }

    String parseRequestBody(HttpExchange t) throws IOException {
        InputStreamReader isr = new InputStreamReader(t.getRequestBody(), "utf-8");
        BufferedReader br = new BufferedReader(isr);
        // From now on, the right way of moving from bytes to utf-8 characters:
        int b;
        StringBuilder buf = new StringBuilder(512);
        while ((b = br.read()) != -1) {
            buf.append((char) b);
        }
        br.close();
        isr.close();

        ObjectMapper mapper = new ObjectMapper();
        Map<String, Object> map = mapper.readValue(buf.toString(), Map.class);

        System.out.println(map);
        return buf.toString();
    }
}
