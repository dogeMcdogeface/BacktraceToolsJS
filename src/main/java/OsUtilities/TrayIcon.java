package OsUtilities;

import javax.imageio.ImageIO;
import java.awt.*;
import java.awt.event.ActionListener;
import java.awt.image.BufferedImage;
import java.util.Objects;
import java.util.ResourceBundle;


public class TrayIcon {
    static java.awt.TrayIcon trayIcon;

    private static final ResourceBundle MESSAGES = ResourceBundle.getBundle("Messages");

    static public void init() {
        System.out.println("Loading Tray Icon");

        //------    Detect System tray compatibility                        ------------------------------------//
        if (!SystemTray.isSupported()) {
            System.err.println("TrayIcon could not be added.");
            return;
        }
        //Can add a tray icon


        //------    Load Tray Icon Image. Use blank if not found            ------------------------------------//
        Image image = new BufferedImage(16, 16, BufferedImage.TYPE_INT_ARGB);
        try {
            image = ImageIO.read(Objects.requireNonNull(TrayIcon.class.getClassLoader().getResourceAsStream("stellar.png")));
        } catch (Exception e) {
            System.err.println("Could not load tray icon");
        }


        //------    Create popup menu for tray icon                         ------------------------------------//
        PopupMenu popup = new PopupMenu();
        //------    Add button to open browser GUI                          ------------//
        MenuItem GuiMenuItem = new MenuItem(MESSAGES.getString("Tray.OpenGUI"));
        GuiMenuItem.addActionListener(e -> Browser.openWebGUI());
        popup.add(GuiMenuItem);

        //------    Add button to close program                             ------------//
        MenuItem exitMenuItem = new MenuItem(MESSAGES.getString("Exit"));
        exitMenuItem.addActionListener(e -> {
            System.out.println("Exiting...");
            System.exit(0);
        });
        popup.add(exitMenuItem);

        //------    Add Tray Icon to system tray                            ------------------------------------//
        trayIcon = new java.awt.TrayIcon(image, MESSAGES.getString("Program.Name"), popup);
        trayIcon.setImageAutoSize(true);

        try {
            SystemTray.getSystemTray().add(trayIcon);
        } catch (AWTException e) {
            System.err.println("error, TrayIcon could not be added.");
            return;
        }


        //------    Add double click action for tray icon                   ------------------------------------//
        ActionListener actionListener = e -> {
            trayIcon.displayMessage("BacktraceTools", MESSAGES.getString("Tray.OpeningGui"), java.awt.TrayIcon.MessageType.INFO);
            Browser.openWebGUI();
        };
        trayIcon.addActionListener(actionListener);

        System.out.println("Tray Icon complete");
    }
}
