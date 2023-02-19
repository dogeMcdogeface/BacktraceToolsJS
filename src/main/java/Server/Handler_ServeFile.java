package Server;

import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;

import java.io.*;
import java.net.URI;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.util.ResourceBundle;

//------    Serve file as would be expected of any server           ------------------------------------//
public class Handler_ServeFile implements HttpHandler {
    private static final ResourceBundle SERVERBUNDLE = ResourceBundle.getBundle("Server");

    @Override
    public void handle(HttpExchange exchange) throws IOException {
        //------    Sanitize server root directory and requested file path  ------------------------------------//
        File root = new File("www").getCanonicalFile();
        URI uri = exchange.getRequestURI();
        File file = new File(root, uri.getPath()).getCanonicalFile();
        System.out.println("Requested File: "+ file);

        //------    Respond with errors if file not allowed or not found    ------------------------------------//
        if (!file.getPath().startsWith(root.getPath())) {         // Suspected path traversal attack: reject with 403 error.
            sendErrorResponse(exchange, 403, "Strings.403");
        } else if (!file.isFile()) {            // Object does not exist or is not a file: reject with 404 error.
            sendErrorResponse(exchange, 404, "Strings.404");
        } else {                        // Object exists and is a file: accept with response code 200.
            sendFile(exchange, file);
        }
    }

    //------    Serve file if found                                     ------------------------------------//
    private static void sendFile(HttpExchange exchange, File file) throws IOException, OutOfMemoryError  {
        // Get the MIME type of the file based on its extension
        String mimeType = Files.probeContentType(file.toPath());
        // Set the MIME type of the response
        exchange.getResponseHeaders().set("Content-Type", mimeType);
        // Send the response with the file contents
        exchange.sendResponseHeaders(200, 0);
        OutputStream outputStream = exchange.getResponseBody();
        FileInputStream fileInputStream = new FileInputStream(file);
        byte[] buffer = new byte[0x10000];
        int count;
        while ((count = fileInputStream.read(buffer)) >= 0) {
            outputStream.write(buffer, 0, count);
        }
        fileInputStream.close();
        outputStream.close();
    }

    //------    Serve error if file not accessible                      ------------------------------------//
    private static void sendErrorResponse(HttpExchange exchange, int code, String key) throws IOException {
        String response = String.format(SERVERBUNDLE.getString(key), "\n");
        exchange.sendResponseHeaders(code, response.length());
        OutputStream outputStream = exchange.getResponseBody();
        outputStream.write(response.getBytes(StandardCharsets.UTF_8));
        outputStream.close();
    }
}
