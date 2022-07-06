package com.etf.ppis.Controller;

import com.etf.ppis.Model.Request.Response;
import com.etf.ppis.Model.Request.ResponseStatus;
import com.etf.ppis.Service.ResponseService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.github.fge.jsonpatch.JsonPatch;
import com.github.fge.jsonpatch.JsonPatchException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import springfox.documentation.swagger2.annotations.EnableSwagger2;

import javax.validation.Valid;
import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@EnableSwagger2
@RequestMapping(path = "/api")
public class ResponseController {
    @Autowired
    ResponseService responseService;

    ObjectMapper objectMapper = new ObjectMapper();

    @GetMapping("/response")
    @PreAuthorize("hasRole('ADMIN') or hasRole('SERVICE') or hasRole('DEV') or hasRole('APPROVER') or hasRole('CLIENT')")
    public ResponseEntity<List<Response>> getAllResponses() {
        List<Response> responses = (List<Response>) responseService.getAll();
        if (responses.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
        return new ResponseEntity<>(responses, HttpStatus.OK);
    }

    @GetMapping("/response/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('SERVICE') or hasRole('DEV') or hasRole('APPROVER') or hasRole('CLIENT')")
    public ResponseEntity<Response> getResponseById(@PathVariable("id") Long id) throws Exception {
        Response newResponse = responseService.findById(id);
        return ResponseEntity.ok().body(newResponse);
    }

    @GetMapping("/response/request/{requestId}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('SERVICE') or hasRole('DEV') or hasRole('APPROVER') or hasRole('CLIENT')")
    public ResponseEntity<List<Response>> getResponsesByRequestId(@PathVariable("requestId") Long id) throws Exception {
        List<Response> newResponses = responseService.findByRequestId(id);
        return ResponseEntity.ok().body(newResponses);
    }

    @PutMapping("/response/{id}")
    public ResponseEntity<String> updateResponse(@PathVariable long id,@Valid @RequestBody Response responseDetails) throws Exception {
        Response updateResponse = responseService.findById(id);
        updateResponse.setDescription(responseDetails.getDescription());
        updateResponse.setStatus(responseDetails.getStatus());
        updateResponse.setCreated(responseDetails.getCreated());
        updateResponse.setRequest(responseDetails.getRequest());
        updateResponse.setReceiver(responseDetails.getReceiver());
        updateResponse.setSender(responseDetails.getSender());

        responseService.save(updateResponse);

        return  new ResponseEntity<>("Response with id = " + id +" successfully updated!", HttpStatus.OK);
    }

    @PostMapping("/response/request/{requestId}/user/{userId}/receiver/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('SERVICE') or hasRole('DEV') or hasRole('APPROVER') or hasRole('CLIENT')")
    public ResponseEntity<Response> addNewResponse(@PathVariable(value = "requestId") Long requestId, @PathVariable(value = "userId") Long userId,@PathVariable(value = "id") Long id, @Valid @RequestBody Response response) throws Exception {
        Response newResponse;
        if(response.getStatus()==null || response.getStatus()== ResponseStatus.NN)
            newResponse = new Response(response.getDescription());
        else newResponse = new Response(response.getDescription(), response.getStatus());

        return new ResponseEntity<>(responseService.addResponse(newResponse, requestId, userId, id), HttpStatus.CREATED);
    }

    private Response applyPatchToResponse(
            JsonPatch patch, Response targetResponse) throws JsonPatchException, JsonProcessingException {
        JsonNode patched = patch.apply(objectMapper.convertValue(targetResponse, JsonNode.class));
        return objectMapper.treeToValue(patched, Response.class);
    }

    @PatchMapping(path = "/response/{id}", consumes = "application/json-patch+json")
    public ResponseEntity updateResponse(@PathVariable Long id, @RequestBody JsonPatch patch) {
        try {
            Response response = responseService.findById(id);
            Response responsePatched = applyPatchToResponse(patch, response);
            responseService.save(responsePatched);
            return new ResponseEntity<>("Response with id = " + id + " successfully updated!", HttpStatus.OK);
        } catch (JsonPatchException | JsonProcessingException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @DeleteMapping("/response/{id}")
    public ResponseEntity<String> deleteResponse(@PathVariable long id){
        responseService.remove(id);
        return new ResponseEntity<>("Response successfully deleted!", HttpStatus.OK);
    }
}
