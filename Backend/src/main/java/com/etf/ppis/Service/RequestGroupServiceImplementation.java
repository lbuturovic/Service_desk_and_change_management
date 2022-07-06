package com.etf.ppis.Service;

import com.etf.ppis.Exceptions.NotFoundException;
import com.etf.ppis.Model.Change.RequestGroup;
import com.etf.ppis.Repository.RequestGroupRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
@Service
public class RequestGroupServiceImplementation implements RequestGroupService{
    @Autowired
    RequestGroupRepository groupRepo;

    @Override
    public List<RequestGroup> getAllGroups() {
        List<RequestGroup> groups = new ArrayList<>();
        groupRepo.findAll().forEach(groups::add);
        return groups;
    }

    @Override
    public RequestGroup createGroup(RequestGroup groupRequest) {
        RequestGroup group;
        group = groupRepo.save(groupRequest);
        return group;
    }

    @Override
    public void deleteGroup(Long id) {
        if (!groupRepo.existsById(id)) {
            throw new NotFoundException("Group with id = " + id + " does not exist!");
        }
        groupRepo.deleteById(id);
        return;
    }

    @Override
    public void deleteAllGroups() {

    }

    @Override
    public RequestGroup getGroupById(Long id) {
        return groupRepo.findById(id)
                .orElseThrow(() -> new NotFoundException("Group with id = " + id + " does not exist!"));
    }

    @Override
    public List<RequestGroup> getByDescriptionContaining(String description) {
        List<RequestGroup> requestGroups = groupRepo.findByDescriptionContaining(description);
        return requestGroups;
    }
}
