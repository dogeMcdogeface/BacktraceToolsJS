package OsUtilities;

import java.awt.*;
import java.io.IOException;
import java.net.URI;
import java.net.URISyntaxException;

class Browser {
    static void openWebGUI() {
        try {
            openDefaultBrowser(new URI("http://localhost:3636/editor/index.html"));
        } catch (IOException | URISyntaxException e) {
            throw new RuntimeException(e);
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
