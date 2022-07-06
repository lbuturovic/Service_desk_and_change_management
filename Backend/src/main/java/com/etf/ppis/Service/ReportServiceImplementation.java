package com.etf.ppis.Service;

import com.etf.ppis.Model.Change.ChangeReport;
import com.etf.ppis.Repository.ChangeReportRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class ReportServiceImplementation implements ReportService {

    @Autowired
    ChangeReportRepository reportRepo;

    @Override
    public List<ChangeReport> getAllReports() {
        List<ChangeReport> reports = new ArrayList<>();
        reportRepo.findAll().forEach(reports::add);
        return reports;
    }

    @Override
    public List<ChangeReport> getAllReportsByChangeId(Long changeId) {
        List<ChangeReport> reports = new ArrayList<>();
        reportRepo.findAllReportsByChangeId(changeId).forEach(reports::add);
        return reports;
    }
}
