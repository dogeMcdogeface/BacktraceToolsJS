package Server;

import JPLInterface.JPLInterface;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;
import org.jpl7.JPLException;

import java.io.*;
import java.nio.charset.StandardCharsets;
import java.text.MessageFormat;
import java.util.Map;
import java.util.ResourceBundle;

//------    Handle AJAX call, containing PROLOG program and query   ------------------------------------//
public class Handler_prologQuery implements HttpHandler {
    private static final ResourceBundle MESSAGES = ResourceBundle.getBundle("Messages");
    private static final ResourceBundle SERVER = ResourceBundle.getBundle("Server");

    @Override
    public void handle(HttpExchange exchange) throws IOException {
        System.out.println(MESSAGES.getString("console.query.received"));
        try {
            // Parse the request body as JSON
            String requestBody = new String(exchange.getRequestBody().readAllBytes(), StandardCharsets.UTF_8);
            JsonNode requestJson = new ObjectMapper().readTree(requestBody);

            // Extract required values from the request
            String program = requestJson.get(SERVER.getString("request.program")).asText();
            String query = requestJson.get(SERVER.getString("request.query")).asText();
            int count = requestJson.get(SERVER.getString("request.count")).asInt();
            String id = requestJson.get(SERVER.getString("request.id")).asText();

            // Check for missing or invalid values
            if (program == null || query.isEmpty() || count <= 0 || id.isEmpty()) {
                throw new IllegalArgumentException("Request has missing or invalid fields");
            }

            // Create a Map with the response data
            Map<String, Object> responseData = JPLInterface.execute(id, program, query, count);

            // Serialize the Map as JSON and send it back to the client
            String response = new ObjectMapper().writeValueAsString(responseData);
            exchange.getResponseHeaders().set("Content-Type", "application/json");
            exchange.sendResponseHeaders(200, response.length());
            exchange.getResponseBody().write(response.getBytes(StandardCharsets.UTF_8));
            exchange.close();
            System.out.println(MESSAGES.getString("console.query.successful"));
        } catch (JsonProcessingException e) {
            System.err.println(MESSAGES.getString("console.query.failed.bad.json") + e);
            exchange.sendResponseHeaders(400, -1); // malformed json
        } catch  (IllegalArgumentException | NullPointerException e) {
            System.err.println(MESSAGES.getString("console.query.failed.bad.fields") + e);
            exchange.sendResponseHeaders(406, -1); // missing or invalid fields
        } catch (JPLException e) {
            System.err.println(MESSAGES.getString("console.query.failed.bad.prolog") + e);
            exchange.sendResponseHeaders(407, -1); // internal server error
        } catch (IOException e) {
            System.err.println(MESSAGES.getString("console.query.failed.server.error") + e);
            exchange.sendResponseHeaders(500, -1); // internal server error
        } catch (Exception e) {
            System.err.println(MESSAGES.getString("console.query.failed.error" + e));
            exchange.sendResponseHeaders(536, -1); // unhandled error
        } finally {
            exchange.close();
        }
    }
}
