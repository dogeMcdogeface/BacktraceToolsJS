package JPLInterface;


import org.jpl7.Query;

import java.io.*;
import java.nio.file.Files;
import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;
import java.util.ResourceBundle;


public class TracedQuery extends Query {
    private static final ResourceBundle PROLOGBUNDLE = ResourceBundle.getBundle("Prolog");
    private final String[] ignoreWords = PROLOGBUNDLE.getString("Prolog.IgnoredWords").split(", ");
    private File traceFile;

    public TracedQuery(String s) {
        super(s);
    }

    public final boolean hasMoreSolutionsT() {
        if (traceFile == null)
            traceFile = JPLInterface.startTrace();

        boolean hasMoreSolutions = super.hasMoreSolutions();
        if (hasMoreSolutions) {
            JPLInterface.updateTrace(traceFile);
        } else {
            JPLInterface.stopTrace(traceFile);
        }
        return hasMoreSolutions;
    }


    public String[] getTrace() {
        try {
            return Files.lines(traceFile.toPath())
                    .filter(line -> Arrays.stream(ignoreWords).noneMatch(line::contains))
                    .toArray(String[]::new);
        } catch (IOException e) {
            System.out.println("Error reading file: " + e.getMessage());
            return null;
        }
    }
}
