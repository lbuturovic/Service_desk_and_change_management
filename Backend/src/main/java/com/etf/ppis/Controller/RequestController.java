package com.etf.ppis.Controller;

import com.etf.ppis.Exceptions.NotFoundException;
import com.etf.ppis.Model.Change.Change;
import com.etf.ppis.Model.Change.ChangeReport;
import com.etf.ppis.Model.Request.Request;
import com.etf.ppis.Model.Users.User;
import com.etf.ppis.Payload.request.SignupRequest;
import com.etf.ppis.Repository.UserRepository;
import com.etf.ppis.Service.RequestService;
import com.etf.ppis.Service.UserService;
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
import java.util.Optional;
@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@EnableSwagger2
@RequestMapping(path = "/api")
public class RequestController {
    @Autowired
    RequestService requestService;

    @Autowired
    UserRepository userRepo;

    ObjectMapper objectMapper = new ObjectMapper();

    @GetMapping("/request")
    @PreAuthorize("hasRole('ADMIN') or hasRole('SERVICE') or hasRole('DEV') or hasRole('APPROVER')")
    public ResponseEntity<List<Request>> getAllRequests() {
        List<Request> requests = (List<Request>) requestService.getAll();
        if (requests.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
        return new ResponseEntity<>(requests, HttpStatus.OK);
    }

    @GetMapping("/group/{groupId}/requests")
    @PreAuthorize("hasRole('ADMIN') or hasRole('SERVICE') or hasRole('DEV') or hasRole('APPROVER')")
    public ResponseEntity<List<Request>> getRequestsByGroup(@PathVariable Long groupId) {
        List<Request> requests =  requestService.getRequestsByGroup(groupId);
        if (requests.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
        return new ResponseEntity<>(requests, HttpStatus.OK);
    }

    @GetMapping("/request/no-group")
    @PreAuthorize("hasRole('ADMIN') or hasRole('SERVICE') or hasRole('DEV') or hasRole('APPROVER')")
    public ResponseEntity<List<Request>> getNoGroupRequests() {
        List<Request> requests = requestService.getNoGroup();
        if (requests.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
        return new ResponseEntity<>(requests, HttpStatus.OK);
    }

    @GetMapping("/request/client/{clientId}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('SERVICE') or hasRole('DEV') or hasRole('APPROVER') or hasRole('CLIENT')")
    public ResponseEntity<List<Request>> getClientRequests(@PathVariable("clientId") Long clientId) {
        List<Request> requests = requestService.getClientRequest(clientId);
        if (requests.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
        return new ResponseEntity<>(requests, HttpStatus.OK);
    }

    @GetMapping("/request/developer/{devId}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('SERVICE') or hasRole('DEV') or hasRole('APPROVER') or hasRole('CLIENT')")
    public ResponseEntity<List<Request>> getDeveloperRequests(@PathVariable("devId") Long devId) {
        List<Request> requests = requestService.getDeveloperRequest(devId);
        if (requests.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
        return new ResponseEntity<>(requests, HttpStatus.OK);
    }

    @GetMapping("/request/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('SERVICE') or hasRole('DEV') or hasRole('APPROVER') or hasRole('CLIENT')")
    public ResponseEntity<Request> getRequestById(@PathVariable("id") Long id) throws Exception {
        Request newRequest = requestService.findById(id);
        return ResponseEntity.ok().body(newRequest);
    }


    @PostMapping("/request/{id}/assign/")
    public ResponseEntity assignTo(@PathVariable Long id, @RequestBody String username){
        User assignee = userRepo.findByUsername(username).orElseThrow(() -> new NotFoundException("User with username = " + username + " does not exist!"));
        try {
            Request request = requestService.findById(id);
            request.setResolving(assignee);
            requestService.save(request);
            return new ResponseEntity<>("Request with id = " + id + " successfully updated!", HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @PostMapping("/user/{userId}/request")
    @PreAuthorize("hasRole('ADMIN') or hasRole('SERVICE') or hasRole('DEV') or hasRole('APPROVER') or hasRole('CLIENT')")
    public ResponseEntity addNewRequest(@PathVariable(value = "userId") Long userId, @Valid @RequestBody Request request) {
        Request newRequest = new Request(request.getSubject(), request.getDescription(), request.getCategory(), request.getPriority());
        return new ResponseEntity<>(requestService.createRequest(userId, newRequest), HttpStatus.CREATED);
    }

    @PutMapping("/user/{userId}/request/{requestId}/close")
    @PreAuthorize("hasRole('ADMIN') or hasRole('SERVICE')")
    public ResponseEntity<Request> closeRequest(@PathVariable(value = "userId") Long userId,
                                              @PathVariable(value = "requestId") Long requestId) {
        return new ResponseEntity<>(requestService.closeRequest(userId,requestId), HttpStatus.CREATED);
    }

    @PutMapping("/request/{requestId}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('DEV') or hasRole('SERVICE')")
    public ResponseEntity<Request> updateRequest(@PathVariable(value = "requestId") Long requestId,
                                                 @Valid @RequestBody Request request) {
        return new ResponseEntity<>(requestService.updateRequest(requestId, request), HttpStatus.CREATED);
    }

    @PutMapping("/request/{requestId}/resolving/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('DEV') or hasRole('SERVICE')")
    public ResponseEntity<Request> updateRequestResolving(@PathVariable(value = "requestId") Long requestId,
                                                 @PathVariable(value = "id") Long id,
                                                 @Valid @RequestBody Request request) {
        return new ResponseEntity<>(requestService.updateRequestResolving(requestId,id, request), HttpStatus.CREATED);
    }

    @PutMapping("/request/{requestId}/group/{groupId}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('DEV') or hasRole('SERVICE')")
    public ResponseEntity<Request> updateRequest(@PathVariable(value = "requestId") Long requestId,
                                                 @PathVariable(value = "groupId") Long groupId,
                                                 @Valid @RequestBody Request request) {
        return new ResponseEntity<>(requestService.updateRequest(requestId,groupId, request), HttpStatus.CREATED);
    }

    @PutMapping("/request/{requestId}/group/{groupId}/resolving/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('DEV') or hasRole('SERVICE')")
    public ResponseEntity<Request> updateRequest(@PathVariable(value = "requestId") Long requestId,
                                                 @PathVariable(value = "groupId") Long groupId,
                                                 @PathVariable(value = "id") Long id,
                                                 @Valid @RequestBody Request request) {
        return new ResponseEntity<>(requestService.updateRequestResolving(requestId,groupId,id, request), HttpStatus.CREATED);
    }

    private Request applyPatchToRequest(
            JsonPatch patch, Request targetRequest) throws JsonPatchException, JsonProcessingException {
        JsonNode patched = patch.apply(objectMapper.convertValue(targetRequest, JsonNode.class));
        return objectMapper.treeToValue(patched, Request.class);
    }

    @PatchMapping(path = "/request/{id}", consumes = "application/json-patch+json")
    public ResponseEntity updateRequest(@PathVariable Long id, @RequestBody JsonPatch patch) {
        try {
            Request request = requestService.findById(id);
            Request requestPatched = applyPatchToRequest(patch, request);
            requestService.save(requestPatched);
            return new ResponseEntity<>("Request with id = " + id + " successfully updated!", HttpStatus.OK);
        } catch (JsonPatchException | JsonProcessingException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @DeleteMapping("/request/{id}")
    public ResponseEntity<String> deleteRequest(@PathVariable long id){
        requestService.remove(id);
        return new ResponseEntity<>("Request successfully deleted!", HttpStatus.OK);
    }

    @PutMapping("/request/{requestId}/assign-group/{groupId}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('DEV') or hasRole('SERVICE')")
    public ResponseEntity<Request> updateGroup(@PathVariable(value = "requestId") Long requestId,
                                                 @PathVariable(value = "groupId") Long groupId){
        return new ResponseEntity<>(requestService.assignGroup(requestId,groupId), HttpStatus.CREATED);
    }
}
