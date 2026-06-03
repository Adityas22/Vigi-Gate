package com.example.vigi_gate.service;

import org.springframework.stereotype.Service;

@Service
public class AIService {
    
    public String generateInsight(int total, int green, int yellow, int red) {
        StringBuilder report = new StringBuilder();
        
        // 1. Executive Summary
        report.append("Laporan Keamanan Harian (Daily Security Brief)\n");
        report.append("==============================================\n");
        report.append(String.format("Total Kunjungan Hari Ini: %d tamu.\n", total));
        report.append(String.format("Distribusi Risiko: %d Aman (Green), %d Waspada (Yellow), %d Bahaya (Red).\n\n", green, yellow, red));
        
        // 2. Trend Analysis
        report.append("Analisis Tren Keamanan:\n");
        if (red > 0) {
            report.append("- [CRITICAL] Ditemukan adanya aktivitas kunjungan dengan indikasi SPAM/Anomali Tinggi (Kategori Merah). Hal ini bisa mengindikasikan upaya pengintaian (casing) atau gangguan keamanan.\n");
        } else if (yellow > 0) {
            report.append("- [WARNING] Terdapat pola kunjungan berulang dari individu yang sama (Kategori Kuning). Pola ini masih dalam batas toleransi namun perlu diawasi jika berlanjut ke hari berikutnya.\n");
        } else {
            report.append("- [SAFE] Seluruh aktivitas kunjungan hari ini berjalan normal. Tidak ada lonjakan frekuensi atau upaya akses mencurigakan.\n");
        }
        
        // 3. Actionable Recommendations
        report.append("\nRekomendasi Tindakan (Actionable Recommendations):\n");
        if (red > 0) {
            report.append("1. Segera lakukan audit CCTV pada jam kedatangan tamu berstatus RED.\n");
            report.append("2. Instruksikan petugas gerbang utama (Security) untuk menahan identitas asli tamu tersebut jika ia kembali besok.\n");
        } else if (yellow > 0) {
            report.append("1. Petugas keamanan dihimbau untuk menanyakan tujuan spesifik jika tamu berstatus YELLOW kembali berkunjung.\n");
        } else {
            report.append("1. Pertahankan protokol pengecekan identitas standar (SOP 1).\n");
        }
        
        return report.toString();
    }
}
