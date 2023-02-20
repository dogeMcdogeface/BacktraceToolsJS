package Server;

import JPLInterface.JPLInterface;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;

import java.io.*;
import java.nio.charset.StandardCharsets;
import java.util.Map;
import java.util.ResourceBundle;

//------    Handle AJAX call, containing PROLOG program and query   ------------------------------------//
public class Handler_Query implements HttpHandler {
    private static final ResourceBundle MESSAGES = ResourceBundle.getBundle("Messages");
    private static final ResourceBundle SERVERBUNDLE = ResourceBundle.getBundle("Server");

    @Override
    public void handle(HttpExchange exchange) throws IOException {
        System.out.println("Received Query");
        try {
            // Parse the request body as JSON
            String requestBody = new String(exchange.getRequestBody().readAllBytes(), StandardCharsets.UTF_8);
            JsonNode requestJson = new ObjectMapper().readTree(requestBody);

            // Extract required values from the request
            String program = requestJson.get("program").asText();
            String query = requestJson.get("query").asText();
            int count = requestJson.get("count").asInt();
            String id = requestJson.get("id").asText();

            // Check for missing or invalid values
            if (program == null || query.isEmpty() || count <= 0 || id.isEmpty()) {
                throw new IllegalArgumentException("Request has missing or invalid fields");
            }

            // Do something with the extracted values
            System.out.println("program: " + program);
            System.out.println("query: " + query);
            System.out.println("count: " + count);
            System.out.println("id: " + id);

            // Create a Map with the response data
            Map<String, Object> responseData = JPLInterface.execute(id, program, query, count);

            // Serialize the Map as JSON and send it back to the client
            String response = new ObjectMapper().writeValueAsString(responseData);
            exchange.getResponseHeaders().set("Content-Type", "application/json");
            exchange.sendResponseHeaders(200, response.length());
            exchange.getResponseBody().write(response.getBytes());
            exchange.close();
            System.out.println("Query successful");
        } catch (JsonProcessingException e) {
            System.out.println("Query failed, malformed json");
            exchange.sendResponseHeaders(400, -1); // malformed json
        } catch  (IllegalArgumentException | NullPointerException e) {
            System.out.println("Query failed, missing or invalid fields");
            exchange.sendResponseHeaders(406, -1); // missing or invalid fields
        } catch (IOException e) {
            System.out.println("Query failed, internal server error");
            exchange.sendResponseHeaders(500, -1); // internal server error
        } catch (Exception e) {
            System.err.println("Query failed, handled error: "+ e);
            exchange.sendResponseHeaders(536, -1); // internal server error
        } finally {
            exchange.close();
        }
    }
}
