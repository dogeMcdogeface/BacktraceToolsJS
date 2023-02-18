package Server;

import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.net.URI;
import java.nio.charset.StandardCharsets;
import java.text.MessageFormat;
import java.util.ResourceBundle;

//------    Serve file as would be expected of any server           ------------------------------------//

public class Handler_Default implements HttpHandler {
    private static final ResourceBundle SERVERBUNDLE = ResourceBundle.getBundle("Server");

    @Override
    public void handle(HttpExchange t) throws IOException {

        //------    Sanitize server root directory and requested file path  ------------------------------------//
        File root = new File("www/").getCanonicalFile();
        URI uri = t.getRequestURI();
        File file = new File(root + uri.getPath()).getCanonicalFile();
        System.out.println("Requested file: " + file);

        //------    Respond with errors if file not allowed or not found    ------------------------------------//
        if (!file.getPath().startsWith(root.getPath())) {
            // Suspected path traversal attack: reject with 403 error.
            String response = MessageFormat.format(SERVERBUNDLE.getString("Strings.403"), "\n");
            t.sendResponseHeaders(403, response.length());
            OutputStream os = t.getResponseBody();
            os.write(response.getBytes(StandardCharsets.UTF_8));
            os.close();
        } else if (!file.isFile()) {
            // Object does not exist or is not a file: reject with 404 error.
            String response = MessageFormat.format(SERVERBUNDLE.getString("Strings.404"), "\n");
            t.sendResponseHeaders(404, response.length());
            OutputStream os = t.getResponseBody();
            os.write(response.getBytes(StandardCharsets.UTF_8));
            os.close();
        } else {
            //------    Serve file if found                                     ------------------------------------//
            // Object exists and is a file: accept with response code 200.
            t.sendResponseHeaders(200, 0);
            OutputStream os = t.getResponseBody();
            FileInputStream fs = new FileInputStream(file);
            byte[] buffer = new byte[0x10000];
            int count;
            while ((count = fs.read(buffer)) >= 0) {
                os.write(buffer, 0, count);
            }
            fs.close();
            os.close();
        }
    }
}
