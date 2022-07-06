/*package ba.unsa.etf.pnwt.petcenter.Exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;

import javax.validation.ConstraintViolationException;
import java.util.ArrayList;


@RestControllerAdvice
public class ControllerExceptionHandler {
    @ExceptionHandler(NotFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public ResponseEntity<ApiError> handleError(NotFoundException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ApiError("Not found",ex.getMessage()));
    }

    @ExceptionHandler(ConstraintViolationException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ResponseEntity<ApiError> handleConstraintViolationExceptions(ConstraintViolationException ex){
        String messages ="";
        ArrayList<String> errors = new ArrayList<>();
        ex.getConstraintViolations().forEach((constraintViolation) -> {
            String message = constraintViolation.getMessage();
            errors.add(message);

        });
        for (String msg: errors){
            messages=messages+msg + " ";
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ApiError("Validation",messages));
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiError> handleMethodArgumentNotValidException( MethodArgumentNotValidException apiError){
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ApiError("Validation",apiError.getFieldError().getDefaultMessage()));
    }

    @ExceptionHandler(MethodArgumentTypeMismatchException.class)
    public ResponseEntity<?> handleArgumentTypeMismatchException(MethodArgumentTypeMismatchException apiError){
        ErrorDetails errorDetails = new ErrorDetails("Method Argument Type Mismatch Exception",apiError.getMessage() + "caused problem!");
        return new ResponseEntity(errorDetails, HttpStatus.BAD_REQUEST);
    }
}*/
