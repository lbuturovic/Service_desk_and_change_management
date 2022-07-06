package com.etf.ppis.Repository;

import com.etf.ppis.Model.Change.ChangeReport;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ChangeReportRepository extends CrudRepository<ChangeReport, Long> {
    @Query(
            value = "SELECT * FROM reports r WHERE r.change_id = ?1 ORDER BY r.created ",
            nativeQuery = true)
    List<ChangeReport> findAllReportsByChangeId(Long id);
}
