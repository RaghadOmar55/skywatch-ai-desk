import java.util.Scanner;

public class TrianglePrinter {

	public static void main(String[] args) {
		 Scanner scanner = new Scanner(System.in);
	        System.out.print("Enter the number of rows for the triangle: ");
	        int numRows = scanner.nextInt();
	        for (int r=1 ; r<=numRows ; r+=1) 
	        {
	        for (int i = 1; i <= 10-1 ; i++)
	        	System.out.print("");
	        
	            for (int j = 1; j <= r; j++) 
	                System.out.print("* ");
	            
	       System.out.println();
	}
}
}