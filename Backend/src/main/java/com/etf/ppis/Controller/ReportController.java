package com.etf.ppis.Controller;

import com.etf.ppis.Model.Change.Change;
import com.etf.ppis.Model.Change.ChangeReport;
import com.etf.ppis.Service.ReportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import springfox.documentation.swagger2.annotations.EnableSwagger2;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@EnableSwagger2
@RestController
@RequestMapping(path = "/api")
public class ReportController {
    @Autowired
    ReportService reportService;

    @GetMapping("/reports")
    @PreAuthorize("hasRole('ADMIN') or hasRole('SERVICE') or hasRole('DEV') or hasRole('APPROVER')")
    public ResponseEntity<List<ChangeReport>> getAllChanges() {
        List<ChangeReport> reports = reportService.getAllReports();
        if (reports.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
        return new ResponseEntity<>(reports, HttpStatus.OK);
    }

    @GetMapping("/change/{changeId}/reports")
    @PreAuthorize("hasRole('ADMIN') or hasRole('SERVICE') or hasRole('DEV') or hasRole('APPROVER')")
    public ResponseEntity<List<ChangeReport>> getReportsByChangeId(@PathVariable(value = "changeId") Long id) {
        List<ChangeReport> reports = reportService.getAllReportsByChangeId(id);
        if (reports.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
        return new ResponseEntity<>(reports, HttpStatus.OK);
    }
}
