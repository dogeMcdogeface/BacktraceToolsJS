import Server.MyServer;

public final class Main {
    public static void main(final String[] args) {
        System.out.println("Starting BacktraceTools");
        OsUtilities.TrayIcon.init();
        MyServer.init(3636);
    }
}
