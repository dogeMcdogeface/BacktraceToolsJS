package JPLexample;



public class samplePL {
    public static String query = "(jealous(X,Y))";
    public static String program = """
            loves(vincent, mia).
            loves(marcellus, mia).
            loves(pumpkin, honey_bunny).
            loves(honey_bunny, pumpkin).
                        
            jealous(X, Y) :-
                loves(X, Z),
                loves(Y, Z),
                X \\== Y.
            """;


}
class infinitePL {
    public static String query = "foo(a,c)";
    public static String program = """
            foo(a,b).
            foo(b,c).
                        
            foo(A,B) :-
            A=B.
                        
            foo(A,B) :-
            foo(B,A).
                        
            foo(A,B) :-
            foo(A,X),foo(X,B).
            """;
}