package com.etf.ppis.Service;

import com.etf.ppis.Model.Change.RequestGroup;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface RequestGroupService {
    List<RequestGroup> getAllGroups();
    RequestGroup createGroup(RequestGroup groupRequest);
    void deleteGroup(Long id);
    void deleteAllGroups();
    RequestGroup getGroupById(Long id);
    List<RequestGroup> getByDescriptionContaining(String description);
}
