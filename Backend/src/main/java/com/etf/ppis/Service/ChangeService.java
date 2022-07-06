package com.etf.ppis.Service;

import com.etf.ppis.Model.Change.Change;
import com.etf.ppis.Model.Change.ChangeReport;
import com.etf.ppis.Model.Change.ChangeStatus;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface ChangeService {
    List<Change> getAllChanges();
    List<Change> getAllChangesByGroupId(Long id);
    Change createChange(Long initiatorId, Long groupId, Change changeRequest);
    Change createChangeGroupNull(Long initiatorId, Change changeRequest);
    Change updateStatus(Long executorId, Long changeId, Change change);
    Change getChangeById(Long id);
    //Change approveChange(Long approverId, Long changeId, ChangeReport reportRequest);
    //Change closeChange(Long approverId, Long changeId, ChangeReport reportRequest);
    //Change rejectChange(Long approverId, Long changeId, ChangeReport reportRequest);
    ChangeReport updateChange(Long userId, Long changeId, ChangeReport changeRequest);
    ChangeReport updateChangeApprover(Long userId, Long changeId, ChangeReport changeRequest, ChangeStatus status);
    List<Change> getActiveChanges();
    List<Change> getPendingChanges();
    List<Change> getClosedChanges();
}
