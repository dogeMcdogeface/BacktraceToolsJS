import Server.MyServer;

public class Main {
    public static void main(String[] args) {
        System.out.println("Starting BacktraceTools");
        OsUtilities.TrayIcon.init();
        MyServer.init(3636);

    }
}
