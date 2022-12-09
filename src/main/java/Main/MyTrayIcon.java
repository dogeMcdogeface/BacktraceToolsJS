package Main;

import javax.imageio.ImageIO;
import java.awt.*;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.awt.event.MouseEvent;
import java.awt.event.MouseListener;
import java.io.File;

import static Main.Main.openDefaultBrowser;
import static Main.Main.openWebGUI;

public class MyTrayIcon {


    static public void init() {
        final TrayIcon trayIcon;
        if (SystemTray.isSupported()) {
            SystemTray tray = SystemTray.getSystemTray();

            //*********************************************//

            Image image = Toolkit.getDefaultToolkit().getImage("stellar.png");
            PopupMenu popup = new PopupMenu();
            trayIcon = new TrayIcon(image, "BacktraceTools", popup);
            trayIcon.setImageAutoSize(true);


            MenuItem exitItem = new MenuItem("Esci");
            popup.add(exitItem);
            exitItem.addActionListener(new ActionListener() {
                public void actionPerformed(ActionEvent e) {
                    System.out.println("Exiting...");
                    System.exit(0);
                }
            });

            MenuItem GUIItem = new MenuItem("Apri interfaccia");
            popup.add(GUIItem);
            GUIItem.addActionListener(new ActionListener() {
                public void actionPerformed(ActionEvent e) {
                    openWebGUI();
                }
            });


            ActionListener actionListener = new ActionListener() {
                public void actionPerformed(ActionEvent e) {
                    trayIcon.displayMessage("BacktraceTools", "Opening web GUI", TrayIcon.MessageType.INFO);
                    openWebGUI();
                }
            };

            trayIcon.addActionListener(actionListener);


            /*trayIcon.addMouseListener( new MouseListener() {
                public void mouseClicked(MouseEvent e) {
                    if(e.getButton() == )
                    System.out.println("Tray Icon - Mouse clicked!");
                    openWebGUI();
                }
                @Override
                public void mousePressed(MouseEvent e) {}
                @Override
                public void mouseReleased(MouseEvent e) {}
                @Override
                public void mouseEntered(MouseEvent e) {}
                @Override
                public void mouseExited(MouseEvent e) {}
            });*/


            try {
                tray.add(trayIcon);
            } catch (AWTException e) {
                System.err.println("TrayIcon could not be added.");
            }

        } else {
            System.err.println("TrayIcon could not be added.");
        }
    }


}
