import Server.MyServer;

public final class Main {
    public static void main(final String[] args) {
        System.out.println("Starting BacktraceTools");
        int port = args.length > 0 ? Integer.parseInt(args[0]) : 3636;
        OsUtilities.TrayIcon.init(port);
        MyServer.init(port);
    }
}