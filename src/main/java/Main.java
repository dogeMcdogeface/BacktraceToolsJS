import JPLInterface.JPLInterface;
import Server.MyServer;

public final class Main {
    public static void main(final String[] args) {
        System.out.println("Starting BacktraceTools");
        OsUtilities.TrayIcon.init();
        JPLInterface.init();
        MyServer.init(3636);
    }
}
