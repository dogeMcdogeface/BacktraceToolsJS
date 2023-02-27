package OsUtilities;

import java.awt.*;
import java.io.IOException;
import java.net.URI;
import java.net.URISyntaxException;

class Browser {
    static void openWebGUI(int port) {
        try {
            openDefaultBrowser(new URI("http://localhost:"+port+"/editor/index.html"));
        } catch (IOException | URISyntaxException e) {
            System.err.println(e);
        }
    }

    private static void openDefaultBrowser(URI uri) throws IOException {
        if (Desktop.isDesktopSupported() && Desktop.getDesktop().isSupported(Desktop.Action.BROWSE)) {
            // windows
            Desktop desktop = Desktop.getDesktop();
            desktop.browse(uri);
        } else {
            // linux / mac
            Runtime runtime = Runtime.getRuntime();
            runtime.exec(new String[]{"xdg-open ", uri.toString()});
        }
    }
}
