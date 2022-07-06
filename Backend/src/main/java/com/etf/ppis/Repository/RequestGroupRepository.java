package com.etf.ppis.Repository;
import com.etf.ppis.Model.Change.RequestGroup;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RequestGroupRepository extends CrudRepository<RequestGroup, Long> {
    List<RequestGroup> findByDescriptionContaining(String description);
}
