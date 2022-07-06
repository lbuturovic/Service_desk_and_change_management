package com.etf.ppis.Service;

import com.etf.ppis.Model.Change.ChangeReport;
import com.etf.ppis.Repository.ChangeReportRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface ReportService {
    List<ChangeReport> getAllReports();
    List<ChangeReport> getAllReportsByChangeId(Long changeId);
}
