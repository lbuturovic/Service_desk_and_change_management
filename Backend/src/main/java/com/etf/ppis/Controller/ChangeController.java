package com.etf.ppis.Controller;

import com.etf.ppis.Model.Change.Change;
import com.etf.ppis.Model.Change.ChangeReport;
import com.etf.ppis.Model.Change.ChangeStatus;
import com.etf.ppis.Model.Users.User;
import com.etf.ppis.Service.ChangeService;
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
public class ChangeController {
    @Autowired
    ChangeService changeService;

    @GetMapping("/pending-changes")
    @PreAuthorize("hasRole('ADMIN') or hasRole('SERVICE') or hasRole('DEV') or hasRole('APPROVER')")
    public ResponseEntity<List<Change>> getPendingChanges() {
        List<Change> changes = changeService.getPendingChanges();
        if (changes.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
        return new ResponseEntity<>(changes, HttpStatus.OK);
    }

    @GetMapping("/active-changes")
    @PreAuthorize("hasRole('ADMIN') or hasRole('SERVICE') or hasRole('DEV') or hasRole('APPROVER')")
    public ResponseEntity<List<Change>> getActiveChanges() {
        List<Change> changes = changeService.getActiveChanges();
        if (changes.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
        return new ResponseEntity<>(changes, HttpStatus.OK);
    }

    @GetMapping("/closed-changes")
    @PreAuthorize("hasRole('ADMIN') or hasRole('SERVICE') or hasRole('DEV') or hasRole('APPROVER')")
    public ResponseEntity<List<Change>> getClosedChanges() {
        List<Change> changes = changeService.getClosedChanges();
        if (changes.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
        return new ResponseEntity<>(changes, HttpStatus.OK);
    }

    @GetMapping("/changes")
    @PreAuthorize("hasRole('ADMIN') or hasRole('SERVICE') or hasRole('DEV') or hasRole('APPROVER')")
    public ResponseEntity<List<Change>> getAllChanges() {
        List<Change> changes = changeService.getAllChanges();
        if (changes.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
        return new ResponseEntity<>(changes, HttpStatus.OK);
    }

    @GetMapping("/changes/{changeId}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('SERVICE') or hasRole('DEV') or hasRole('APPROVER')")
    public ResponseEntity<Change> getChangeById(@PathVariable(value = "changeId") Long id) {
        Change change = changeService.getChangeById(id);
        return new ResponseEntity<>(change, HttpStatus.OK);
    }

    @GetMapping("/group/{groupId}/changes")
    @PreAuthorize("hasRole('ADMIN') or hasRole('SERVICE') or hasRole('DEV') or hasRole('APPROVER')")
    public ResponseEntity<List<Change>> getAllChangesByGroupId(@PathVariable(value = "groupId") Long groupId) {
        List<Change> changes = changeService.getAllChangesByGroupId(groupId);
        if (changes.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
        return new ResponseEntity<>(changes, HttpStatus.OK);
    }

    @PostMapping("/user/{userId}/group/{groupId}/changes")
    @PreAuthorize("hasRole('ADMIN') or hasRole('SERVICE') or hasRole('APPROVER')")
    public ResponseEntity<Change> createChange(@PathVariable(value = "userId") Long userId,
                                               @PathVariable(value = "groupId") Long groupId,
                                           @Valid @RequestBody Change changeRequest) {
        return new ResponseEntity<>(changeService.createChange(userId, groupId, changeRequest), HttpStatus.CREATED);
    }

    @PostMapping("/user/{userId}/changes")
    @PreAuthorize("hasRole('ADMIN') or hasRole('SERVICE') or hasRole('APPROVER')")
    public ResponseEntity<Change> createChangeNullGroup(@PathVariable(value = "userId") Long userId,
                                               @Valid @RequestBody Change changeRequest) {
        return new ResponseEntity<>(changeService.createChangeGroupNull(userId, changeRequest), HttpStatus.CREATED);
    }

    //odnosi se najvise na status
    @PutMapping("/user/{userId}/change/{changeId}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('DEV') or hasRole('APPROVER')")
    public ResponseEntity<ChangeReport> updateChange(@PathVariable(value = "userId") Long userId,
                                               @PathVariable(value = "changeId") Long changeId,
                                               @Valid @RequestBody ChangeReport changeReportRequest) {
        return new ResponseEntity<>(changeService.updateChange(userId,changeId, changeReportRequest), HttpStatus.CREATED);
    }

    @PutMapping("/user/{userId}/change/{changeId}/approve")
    @PreAuthorize("hasRole('ADMIN') or hasRole('APPROVER')")
    public ResponseEntity<ChangeReport> approveChange(@PathVariable(value = "userId") Long userId,
                                               @PathVariable(value = "changeId") Long changeId,
                                                @Valid @RequestBody ChangeReport changeReportRequest) {
        return new ResponseEntity<>(changeService.updateChangeApprover(userId,changeId, changeReportRequest, ChangeStatus.ACCEPTED), HttpStatus.CREATED);
    }

    @PutMapping("/user/{userId}/change/{changeId}/close")
    @PreAuthorize("hasRole('ADMIN') or hasRole('APPROVER')")
    public ResponseEntity<ChangeReport> closeChange(@PathVariable(value = "userId") Long userId,
                                                @PathVariable(value = "changeId") Long changeId,
                                              @Valid @RequestBody ChangeReport changeReportRequest) {
        return new ResponseEntity<>(changeService.updateChangeApprover(userId,changeId, changeReportRequest, ChangeStatus.CLOSED), HttpStatus.CREATED);
    }

    @PutMapping("/user/{userId}/change/{changeId}/reject")
    @PreAuthorize("hasRole('ADMIN') or hasRole('APPROVER')")
    public ResponseEntity<ChangeReport> rejectChange(@PathVariable(value = "userId") Long userId,
                                              @PathVariable(value = "changeId") Long changeId,
                                               @Valid @RequestBody ChangeReport changeReportRequest) {
        return new ResponseEntity<>(changeService.updateChangeApprover(userId,changeId, changeReportRequest, ChangeStatus.REJECTED), HttpStatus.CREATED);
    }

}
