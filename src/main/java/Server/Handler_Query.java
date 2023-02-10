package Server;

import JPLInterface.JPLInterface;
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
    public void handle(HttpExchange t) throws IOException {
        //------    Parse JSON request into MAP.                            ------------------------------------//
        Map<String, Object> request = parseRequest(t);
        String response = MESSAGES.getString("Console.error");

        //------    If mandatory fields are missing, respond with error     ------------------------------------//
        if (!request.containsKey(SERVERBUNDLE.getString("keyword.program"))) {
            response += " " + MESSAGES.getString("Console.cantParseProgram");
        } else if (!request.containsKey(SERVERBUNDLE.getString("keyword.query"))) {
            response += " " + MESSAGES.getString("Console.cantParseQuery");
        } else if (!request.containsKey(SERVERBUNDLE.getString("keyword.queryid"))) {
            response += " " + MESSAGES.getString("Console.cantParseQueryId");
        } else if (!request.containsKey(SERVERBUNDLE.getString("keyword.count"))) {
            response += " " + MESSAGES.getString("Console.cantParseCount");
        } else {
            //------Otherwise, execute request passing parameters           ------------------------------------//
            String id = (String) request.get(SERVERBUNDLE.getString("keyword.queryid"));
            String program = (String) request.get(SERVERBUNDLE.getString("keyword.program"));
            String query = (String) request.get(SERVERBUNDLE.getString("keyword.query"));
            int count = (Integer) request.get(SERVERBUNDLE.getString("keyword.count"));

            Map results = JPLInterface.execute(id, program, query, count);
            System.out.println(results);
            try {
                response = new ObjectMapper().writeValueAsString(results);
            }catch (Exception e){
                System.err.println(e);
            }
        }

        //System.out.println("API Request: " + request + "\nResponse: " + response);

        //------    Send results to browser for displaying to user          ------------------------------------//
        t.getResponseHeaders().set("Content-Type", "application/json");
        t.sendResponseHeaders(200, response.length());
        OutputStream os = t.getResponseBody();
        os.write(response.getBytes());
        os.close();
    }

    //------    Parse incoming JSON into java MAP                       ------------------------------------//
    Map<String, Object> parseRequest(HttpExchange t) throws IOException {
        InputStreamReader isr = new InputStreamReader(t.getRequestBody(), StandardCharsets.UTF_8);
        BufferedReader br = new BufferedReader(isr);
        int b;
        StringBuilder buf = new StringBuilder(512);
        while ((b = br.read()) != -1) {
            buf.append((char) b);
        }
        br.close();
        isr.close();

        ObjectMapper mapper = new ObjectMapper();
        return mapper.readValue(buf.toString(), Map.class);
    }
}
