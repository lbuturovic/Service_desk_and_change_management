package com.etf.ppis.Service;

import com.etf.ppis.Exceptions.NotFoundException;
import com.etf.ppis.Model.Change.Change;
import com.etf.ppis.Model.Change.ChangeReport;
import com.etf.ppis.Model.Change.ChangeStatus;
import com.etf.ppis.Model.Change.RequestGroup;
import com.etf.ppis.Model.Users.User;
import com.etf.ppis.Repository.ChangeReportRepository;
import com.etf.ppis.Repository.ChangeRepository;
import com.etf.ppis.Repository.RequestGroupRepository;
import com.etf.ppis.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ChangeServiceImplementation implements ChangeService{
    @Autowired
    ChangeRepository changeRepo;
    @Autowired
    RequestGroupRepository groupRepo;
    @Autowired
    UserRepository userRepo;
    @Autowired
    ChangeReportRepository changeReportRepo;
    @Autowired
    RequestGroupService groupService;
    @Override
    public List<Change> getAllChanges() {
        List<Change> changes = new ArrayList<>();
        changeRepo.findAll().forEach(changes::add);
        return changes;
    }

    @Override
    public List<Change> getAllChangesByGroupId(Long groupId) {
       RequestGroup group = groupService.getGroupById(groupId);
        List<Change> changes = changeRepo.findByGroup(group);
        return changes;
    }

    @Override
    public Change createChange(Long initiatorId, Long groupId, Change changeRequest) {
        Change change = userRepo.findById(initiatorId).map(reporter -> {
            Change change2 = groupRepo.findById(groupId).map(group -> {
                changeRequest.setGroup(group);
                return changeRepo.save(changeRequest);
            }).orElseThrow(() -> new NotFoundException("Group with id = " + groupId + " does not exist!"));
            change2.setReporter(reporter);
            change2.setExecutor(reporter);
            change2.setStatus(ChangeStatus.valueOf("PENDING"));
            return changeRepo.save(change2);
        }).orElseThrow(() -> new NotFoundException("User with id = " + initiatorId + " does not exist!"));
        ChangeReport changeReport = new ChangeReport(change, change.getDescription(), null, null);
        changeReportRepo.save(changeReport);
        return change;

    }

    @Override
    public Change createChangeGroupNull(Long initiatorId, Change changeRequest) {
        Change change = userRepo.findById(initiatorId).map(reporter -> {
            changeRequest.setReporter(reporter);
            changeRequest.setExecutor(reporter);
            changeRequest.setStatus(ChangeStatus.valueOf("PENDING"));
            changeRequest.setGroup(null);
            return changeRepo.save(changeRequest);
        }).orElseThrow(() -> new NotFoundException("User with id = " + initiatorId + " does not exist!"));
        ChangeReport changeReport = new ChangeReport(change, change.getDescription(), null, null);
        changeReportRepo.save(changeReport);
        return change;
    }

    @Override
    public Change updateStatus(Long executorId, Long changeId, Change change) {
        Change _change = changeRepo.findById(changeId).orElseThrow(() -> new NotFoundException("Change with id = " + changeId + " does not exist!"));
        _change.setStatus(change.getStatus());
        User user = userRepo.findById(executorId).orElseThrow(() -> new NotFoundException("User with id = " + executorId + " does not exist!"));
        _change.setExecutor(user);
        changeRepo.save(_change);
        return _change;
    }

    @Override
    public Change getChangeById(Long id) {
        Change change = changeRepo.findById(id).orElseThrow(() -> new NotFoundException("Change with id = " + id + " does not exist!"));
        return change;
    }

  /*  @Override
    public Change approveChange(Long approverId, Long changeId, ChangeReport reportRequest) {
        Change _change = changeRepo.findById(changeId).orElseThrow(() -> new NotFoundException("Change with id = " + changeId + " does not exist!"));
        User user = userRepo.findById(approverId).orElseThrow(() -> new NotFoundException("User with id = " + approverId + " does not exist!"));
        _change.setApprover(user);
        _change.setExecutor(user);
        _change.setStatus(ChangeStatus.ACCEPTED);
        changeRepo.save(_change);
        return _change;
    }*/

    @Override
    public ChangeReport updateChangeApprover(Long approverId, Long changeId, ChangeReport reportRequest, ChangeStatus status) {
        Change _change = changeRepo.findById(changeId).orElseThrow(() -> new NotFoundException("Change with id = " + changeId + " does not exist!"));
        User user = userRepo.findById(approverId).orElseThrow(() -> new NotFoundException("User with id = " + approverId + " does not exist!"));
        if (status.equals(ChangeStatus.ACCEPTED)) _change.setApprover(user);
        _change.setExecutor(user);
        _change.setStatus(status);
        reportRequest.setChange(_change);
        reportRequest.setStatus(status);
        reportRequest.setEmployee(user);
        changeRepo.save(_change);
        return changeReportRepo.save(reportRequest);
    }

    @Override
    public List<Change> getActiveChanges() {
        List<Change> changes = changeRepo.findByApproverIsNotNull().stream()
                .filter(c -> !(c.getStatus().equals(ChangeStatus.CLOSED)))
                .collect(Collectors.toList());
        return changes;
    }

    @Override
    public List<Change> getPendingChanges() {
        List<Change> changes = new ArrayList<>();
        changeRepo.findByStatus(ChangeStatus.PENDING).forEach(changes::add);
        return changes;
    }

    @Override
    public List<Change> getClosedChanges() {
        List<Change> changes = new ArrayList<>();
        changeRepo.findByStatus(ChangeStatus.CLOSED).forEach(changes::add);
        return changes;
    }

    @Override
    public ChangeReport updateChange(Long userId, Long changeId, ChangeReport reportRequest) {
        Change _change = changeRepo.findById(changeId).orElseThrow(() -> new NotFoundException("Change with id = " + changeId + " does not exist!"));
        User user = userRepo.findById(userId).orElseThrow(() -> new NotFoundException("User with id = " + userId + " does not exist!"));
        _change.setExecutor(user);
        _change.setStatus(reportRequest.getStatus());
        reportRequest.setChange(_change);
        reportRequest.setEmployee(user);
        changeRepo.save(_change);
        return changeReportRepo.save(reportRequest);
    }

  /*  @Override
    public Change closeChange(Long approverId, Long changeId, ChangeReport reportRequest) {
        Change _change = changeRepo.findById(changeId).orElseThrow(() -> new NotFoundException("Change with id = " + changeId + " does not exist!"));
        User user = userRepo.findById(approverId).orElseThrow(() -> new NotFoundException("User with id = " + approverId + " does not exist!"));
        _change.setApprover(user);
        _change.setExecutor(user);
        _change.setStatus(ChangeStatus.CLOSED);
        changeRepo.save(_change);
        return _change;
    }*/
}
