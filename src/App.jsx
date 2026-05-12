import React, { useEffect, useMemo, useState } from "react";

const initialEquipment = [
  { id: 1, type: "Analizador de monóxido de carbono - CO", code: "CO-001", brand: "HORIBA", model: "APMA-370", serial: "BTW45UDA", status: "Disponible" },
  { id: 2, type: "Analizador de monóxido de carbono - CO", code: "CO-002", brand: "THERMO", model: "Model 48i", serial: "JC120400019", status: "Disponible" },
  { id: 3, type: "Analizador de monóxido de carbono - CO", code: "CO-003", brand: "THERMO", model: "Model 48i", serial: "JC120400195", status: "Disponible" },
  { id: 4, type: "Analizador de monóxido de carbono - CO", code: "CO-004", brand: "HORIBA", model: "APMA-370", serial: "SFA99C2B", status: "Disponible" },
  { id: 5, type: "Analizador de monóxido de carbono - CO", code: "CO-005", brand: "HORIBA", model: "APMA-370", serial: "TTGS63AN", status: "Disponible" },
  { id: 6, type: "Analizador de monóxido de carbono - CO", code: "CO-006", brand: "SABIO", model: "6050", serial: "20100519", status: "Disponible" },
  { id: 7, type: "Analizador de monóxido de carbono - CO", code: "CO-007", brand: "SABIO", model: "6050", serial: "35900220", status: "Disponible" },
  { id: 8, type: "Analizador de monóxido de carbono - CO", code: "CO-008", brand: "SABIO", model: "6050", serial: "33901119", status: "Disponible" },
  { id: 9, type: "Analizador de monóxido de carbono - CO", code: "CO-009", brand: "SABIO", model: "6050", serial: "35800220", status: "Disponible" },
  { id: 10, type: "Analizador de monóxido de carbono - CO", code: "CO-010", brand: "SABIO", model: "6050", serial: "19600519", status: "Disponible" },
  { id: 11, type: "Analizador de monóxido de carbono - CO", code: "CO-011", brand: "TELEDYNE API", model: "T300", serial: "4813", status: "Disponible" },
  { id: 12, type: "Analizador de monóxido de carbono - CO", code: "CO-012", brand: "TELEDYNE API", model: "T300", serial: "4812", status: "Disponible" },
  { id: 13, type: "Analizador de monóxido de carbono - CO", code: "CO-013", brand: "HORIBA", model: "APMA-370", serial: "80MDPEDV", status: "Disponible" },
  { id: 14, type: "Analizador de monóxido de carbono - CO", code: "CO-014", brand: "HORIBA", model: "APMA-370", serial: "W76EGVU9", status: "Disponible" },
  { id: 15, type: "Analizador de monóxido de carbono - CO", code: "CO-015", brand: "HORIBA", model: "APMA-370", serial: "PYJC6430", status: "Disponible" },
  { id: 16, type: "Analizador de monóxido de carbono - CO", code: "CO-016", brand: "FPI", model: "AQMS-400", serial: "104P20A003C", status: "Disponible" },
  { id: 17, type: "Analizador de monóxido de carbono - CO", code: "CO-017", brand: "FPI", model: "AQMS-400", serial: "104P20B00AB", status: "Disponible" },
  { id: 18, type: "Analizador de monóxido de carbono - CO", code: "CO-018", brand: "FPI", model: "AQMS-400", serial: "104P20B00AD", status: "Disponible" },
  { id: 19, type: "Analizador de monóxido de carbono - CO", code: "CO-019", brand: "FPI", model: "AQMS-400", serial: "104P20B00AC", status: "Disponible" },
  { id: 20, type: "Analizador de monóxido de carbono - CO", code: "CO-020", brand: "FPI", model: "AQMS-400", serial: "104P20B0019", status: "Disponible" },
  { id: 21, type: "Analizador de monóxido de carbono - CO", code: "CO-021", brand: "FPI", model: "AQMS-400", serial: "104P2040130", status: "Disponible" },
  { id: 22, type: "Analizador de monóxido de carbono - CO", code: "CO-022", brand: "FPI", model: "AQMS-400", serial: "104P20B00A7", status: "Disponible" },
  { id: 23, type: "Analizador de monóxido de carbono - CO", code: "CO-023", brand: "FPI", model: "AQMS-400", serial: "104P20B00A3", status: "Disponible" },
  { id: 24, type: "Analizador de monóxido de carbono - CO", code: "CO-024", brand: "FPI", model: "AQMS-400", serial: "104P2110054", status: "Disponible" },
  { id: 25, type: "Analizador de monóxido de carbono - CO", code: "CO-025", brand: "FPI", model: "AQMS-400", serial: "104P21300B1", status: "Disponible" },
];

const initialBookings = [
  { id: 1, equipmentId: 1, client: "Cliente A", startDate: "2026-05-15", endDate: "2026-05-20" },
  { id: 2, equipmentId: 3, client: "Cliente B", startDate: "2026-05-18", endDate: "2026-05-25" },
];

const statusOptions = ["Disponible", "Mantenimiento", "Dañado", "Fuera de servicio"];

function isDateBetween(date, start, end) {
  return date >= start && date <= end;
}

function addDays(dateString, days) {
  if (!dateString) return "";
  const date = new Date(`${dateString}T00:00:00`);
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function downloadExcel(filename, rows) {
  const tableRows = rows
    .map((row) => {
      if (row.length === 1) {
        return `<tr><td colspan="12" style="font-weight:bold;background:#e2e8f0;">${escapeHtml(row[0])}</td></tr>`;
      }
      return `<tr>${row.map((cell) => `<td>${escapeHtml(cell)}</td>`).join("")}</tr>`;
    })
    .join("");

  const html = `
    <html>
      <head>
        <meta charset="UTF-8" />
        <style>
          table { border-collapse: collapse; font-family: Arial, sans-serif; }
          td { border: 1px solid #999; padding: 6px; white-space: nowrap; }
          tr:first-child td { background: #0f172a; color: white; font-weight: bold; }
        </style>
      </head>
      <body>
        <table>${tableRows}</table>
      </body>
    </html>
  `;

  const blob = new Blob([html], { type: "application/vnd.ms-excel;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export default function AppDisponibilidadEquipos() {
  const [equipment, setEquipment] = useState(() => {
    const savedEquipment = localStorage.getItem("equipment");
    return savedEquipment ? JSON.parse(savedEquipment) : initialEquipment;
  });

  const [bookings, setBookings] = useState(() => {
    const savedBookings = localStorage.getItem("bookings");
    return savedBookings ? JSON.parse(savedBookings) : initialBookings;
  });

  const [selectedEquipmentId, setSelectedEquipmentId] = useState("1");
  const [selectedBookingEquipmentIds, setSelectedBookingEquipmentIds] = useState(["1"]);
  const [checkDate, setCheckDate] = useState("2026-05-18");
  const [searchText, setSearchText] = useState("");
  const [showEquipmentPicker, setShowEquipmentPicker] = useState(false);

  const [newBooking, setNewBooking] = useState({
    client: "",
    startDate: "",
    endDate: "",
  });

  useEffect(() => {
    localStorage.setItem("equipment", JSON.stringify(equipment));
  }, [equipment]);

  useEffect(() => {
    localStorage.setItem("bookings", JSON.stringify(bookings));
  }, [bookings]);

  const selectedEquipment = useMemo(() => {
    return equipment.find((item) => item.id === Number(selectedEquipmentId));
  }, [equipment, selectedEquipmentId]);

  const availability = useMemo(() => {
    if (!selectedEquipment || !checkDate) return null;

    const conflict = bookings.find(
      (booking) =>
        booking.equipmentId === selectedEquipment.id &&
        isDateBetween(checkDate, booking.startDate, booking.endDate)
    );

    const statusBlocksAvailability = selectedEquipment.status !== "Disponible";

    return {
      available: !conflict && !statusBlocksAvailability,
      conflict,
      statusBlocksAvailability,
      availableDate: conflict ? addDays(conflict.endDate, 1) : "",
    };
  }, [bookings, checkDate, selectedEquipment]);

  const selectedEquipmentBookings = useMemo(() => {
    return bookings
      .filter((booking) => booking.equipmentId === Number(selectedEquipmentId))
      .sort((a, b) => a.startDate.localeCompare(b.startDate));
  }, [bookings, selectedEquipmentId]);

  const allEquipmentStatus = useMemo(() => {
    if (!checkDate) return [];

    return equipment.map((item) => {
      const activeBooking = bookings.find(
        (booking) => booking.equipmentId === item.id && isDateBetween(checkDate, booking.startDate, booking.endDate)
      );

      const futureBookings = bookings
        .filter((booking) => booking.equipmentId === item.id && booking.endDate >= checkDate)
        .sort((a, b) => a.startDate.localeCompare(b.startDate));

      const nextBooking = activeBooking || futureBookings[0] || null;
      const statusBlocksAvailability = item.status !== "Disponible";
      const usageDates = activeBooking ? `${activeBooking.startDate} a ${activeBooking.endDate}` : "";
      const availableFrom = activeBooking ? addDays(activeBooking.endDate, 1) : statusBlocksAvailability ? item.status : "Disponible ahora";

      return {
        ...item,
        available: !activeBooking && !statusBlocksAvailability,
        client: activeBooking?.client || "",
        blockedByStatus: statusBlocksAvailability,
        usageStartDate: activeBooking?.startDate || "",
        usageEndDate: activeBooking?.endDate || "",
        usageDates,
        availableFrom,
        nextBookingStart: nextBooking?.startDate || "",
        nextBookingEnd: nextBooking?.endDate || "",
      };
    });
  }, [equipment, bookings, checkDate]);

  const filteredEquipmentStatus = useMemo(() => {
    const text = searchText.trim().toLowerCase();
    if (!text) return allEquipmentStatus;

    return allEquipmentStatus.filter((item) => {
      return (
        item.serial.toLowerCase().includes(text) ||
        item.code.toLowerCase().includes(text) ||
        item.brand.toLowerCase().includes(text) ||
        item.model.toLowerCase().includes(text) ||
        item.type.toLowerCase().includes(text) ||
        item.status.toLowerCase().includes(text)
      );
    });
  }, [allEquipmentStatus, searchText]);

  const availabilitySummary = useMemo(() => {
    const available = allEquipmentStatus.filter((item) => item.available).length;
    const unavailable = allEquipmentStatus.length - available;
    return { available, unavailable };
  }, [allEquipmentStatus]);

  function toggleBookingEquipment(equipmentId) {
    setSelectedBookingEquipmentIds((current) => {
      if (current.includes(equipmentId)) {
        const next = current.filter((id) => id !== equipmentId);
        return next.length === 0 ? current : next;
      }
      return [...current, equipmentId];
    });
  }

  function selectAllBookingEquipment() {
    setSelectedBookingEquipmentIds(equipment.map((item) => String(item.id)));
  }

  function clearSelectedBookingEquipment() {
    setSelectedBookingEquipmentIds(["1"]);
  }

  function addBooking() {
    if (!newBooking.client || !newBooking.startDate || !newBooking.endDate) {
      alert("Completa cliente, fecha inicial y fecha final.");
      return;
    }

    if (selectedBookingEquipmentIds.length === 0) {
      alert("Selecciona por lo menos un equipo.");
      return;
    }

    if (newBooking.endDate < newBooking.startDate) {
      alert("La fecha final no puede ser menor que la fecha inicial.");
      return;
    }

    const selectedItems = selectedBookingEquipmentIds
      .map((id) => equipment.find((item) => item.id === Number(id)))
      .filter(Boolean);

    const unavailableByStatus = selectedItems.filter((item) => item.status !== "Disponible");
    if (unavailableByStatus.length > 0) {
      alert(
        "Estos equipos no se pueden reservar por su estado físico:\n" +
          unavailableByStatus.map((item) => `${item.code} - ${item.status}`).join("\n")
      );
      return;
    }

    const overlappingItems = selectedItems.filter((item) => {
      return bookings.some((booking) => {
        if (booking.equipmentId !== item.id) return false;
        return newBooking.startDate <= booking.endDate && newBooking.endDate >= booking.startDate;
      });
    });

    if (overlappingItems.length > 0) {
      alert(
        "Estos equipos ya tienen una reserva que cruza con esas fechas:\n" +
          overlappingItems.map((item) => `${item.code} - ${item.serial}`).join("\n")
      );
      return;
    }

    const createdAt = Date.now();
    const newBookings = selectedItems.map((item, index) => ({
      id: createdAt + index,
      equipmentId: item.id,
      client: newBooking.client,
      startDate: newBooking.startDate,
      endDate: newBooking.endDate,
    }));

    setBookings((current) => [...current, ...newBookings]);
    setNewBooking({ client: "", startDate: "", endDate: "" });
    alert(`Reserva creada para ${newBookings.length} equipo(s).`);
  }

  function deleteBooking(id) {
    setBookings((current) => current.filter((booking) => booking.id !== id));
  }

  function clearBookings() {
    const confirmed = window.confirm("¿Seguro que quieres limpiar todas las reservas? Esta acción no se puede deshacer.");
    if (!confirmed) return;
    setBookings([]);
  }

  function updateEquipmentStatus(equipmentId, status) {
    setEquipment((current) => current.map((item) => (item.id === equipmentId ? { ...item, status } : item)));
  }

  function resetDemoData() {
    const confirmed = window.confirm("¿Quieres restaurar equipos y reservas de ejemplo? Se perderán los cambios guardados en este navegador.");
    if (!confirmed) return;
    setEquipment(initialEquipment);
    setBookings(initialBookings);
    setSelectedEquipmentId("1");
    setSelectedBookingEquipmentIds(["1"]);
    setSearchText("");
  }

  function exportToExcel() {
    const rows = [
      [
        "Código interno",
        "Tipo equipo",
        "Marca",
        "Modelo",
        "Serial",
        "Estado físico",
        "Disponibilidad en fecha consultada",
        "Cliente asignado en fecha",
        "Fecha inicio de uso",
        "Fecha fin de uso",
        "Fecha disponible nuevamente",
        "Fecha consultada",
      ],
      ...filteredEquipmentStatus.map((item) => [
        item.code,
        item.type,
        item.brand,
        item.model,
        item.serial,
        item.status,
        item.available ? "Disponible" : "No disponible",
        item.client || (item.blockedByStatus ? item.status : ""),
        item.usageStartDate,
        item.usageEndDate,
        item.availableFrom,
        checkDate,
      ]),
      [],
      ["Reservas registradas"],
      ["Código interno", "Serial", "Marca", "Modelo", "Cliente", "Desde", "Hasta", "Disponible nuevamente"],
      ...bookings.map((booking) => {
        const item = equipment.find((eq) => eq.id === booking.equipmentId);
        return [
          item?.code || "",
          item?.serial || "",
          item?.brand || "",
          item?.model || "",
          booking.client,
          booking.startDate,
          booking.endDate,
          addDays(booking.endDate, 1),
        ];
      }),
    ];

    downloadExcel(`disponibilidad-equipos-${checkDate || "reporte"}.xls`, rows);
  }

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <header style={styles.header}>
          <div>
            <p style={styles.kicker}>MVP inicial</p>
            <h1 style={styles.title}>Disponibilidad de equipos</h1>
            <p style={styles.subtitle}>Consulta si uno de tus analizadores de CO está disponible en una fecha específica y registra reservas por cliente.</p>
          </div>
          <div style={styles.actionsHeader}>
            <div style={styles.counterCard}>
              <p style={styles.smallText}>Equipos registrados</p>
              <p style={styles.counter}>{equipment.length}</p>
            </div>
            <div style={styles.availableCounterCard}>
              <p style={styles.smallText}>Disponibles en la fecha</p>
              <p style={styles.counter}>{availabilitySummary.available}</p>
            </div>
            <div style={styles.unavailableCounterCard}>
              <p style={styles.smallText}>No disponibles</p>
              <p style={styles.counter}>{availabilitySummary.unavailable}</p>
            </div>
            <button style={styles.secondaryButton} onClick={exportToExcel}>Exportar a Excel</button>
            <button style={styles.dangerButton} onClick={clearBookings}>Limpiar reservas</button>
          </div>
        </header>

        <main style={styles.gridMain}>
          <section style={styles.cardLarge}>
            <h2 style={styles.sectionTitle}>Consultar disponibilidad</h2>

            <div style={styles.formGrid}>
              <label style={styles.field}>
                <span style={styles.label}>Equipo / código / serial</span>
                <select style={styles.input} value={selectedEquipmentId} onChange={(event) => setSelectedEquipmentId(event.target.value)}>
                  {equipment.map((item) => (
                    <option key={item.id} value={String(item.id)}>{item.code} - {item.brand} {item.model} - Serial {item.serial}</option>
                  ))}
                </select>
              </label>

              <label style={styles.field}>
                <span style={styles.label}>Fecha a consultar</span>
                <input style={styles.input} type="date" value={checkDate} onChange={(event) => setCheckDate(event.target.value)} />
              </label>
            </div>

            <div style={styles.formGridSingle}>
              <label style={styles.field}>
                <span style={styles.label}>Buscar por serial, código, marca o modelo</span>
                <input style={styles.input} placeholder="Ej: CO-005, TTGS63AN, HORIBA..." value={searchText} onChange={(event) => setSearchText(event.target.value)} />
              </label>
            </div>

            {selectedEquipment && availability && (
              <div style={{ ...styles.resultBox, ...(availability.available ? styles.availableBox : styles.unavailableBox) }}>
                <h3 style={styles.resultTitle}>{availability.available ? "Disponible" : "No disponible"}</h3>
                <p style={styles.resultText}><strong>{selectedEquipment.code}</strong> - {selectedEquipment.type}</p>
                <p style={styles.resultText}>{selectedEquipment.brand} {selectedEquipment.model} - Serial {selectedEquipment.serial}</p>
                <p style={styles.resultText}>Estado físico: <strong>{selectedEquipment.status}</strong></p>
                {availability.statusBlocksAvailability && <p style={styles.resultText}>Este equipo no se puede reservar porque está marcado como <strong>{selectedEquipment.status}</strong>.</p>}
                {!availability.available && availability.conflict && (
                  <p style={styles.resultText}>
                    Está asignado a <strong>{availability.conflict.client}</strong> desde {availability.conflict.startDate} hasta {availability.conflict.endDate}. Disponible nuevamente el <strong>{availability.availableDate}</strong>.
                  </p>
                )}
              </div>
            )}

            <div style={styles.block}>
              <h3 style={styles.subTitle}>Reservas de este equipo</h3>
              {selectedEquipmentBookings.length === 0 ? (
                <p style={styles.emptyBox}>Este equipo no tiene reservas registradas.</p>
              ) : (
                <div style={styles.list}>
                  {selectedEquipmentBookings.map((booking) => (
                    <div key={booking.id} style={styles.bookingItem}>
                      <div>
                        <p style={styles.bookingClient}>{booking.client}</p>
                        <p style={styles.bookingDate}>{booking.startDate} a {booking.endDate} · Disponible: {addDays(booking.endDate, 1)}</p>
                      </div>
                      <button style={styles.deleteButton} onClick={() => deleteBooking(booking.id)}>Eliminar</button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>

          <div style={styles.sideColumn}>
          <section style={styles.card}>
            <h2 style={styles.sectionTitle}>Registrar reserva</h2>

            <div style={styles.field}>
              <span style={styles.label}>Equipos a reservar</span>
              <button
                type="button"
                style={styles.dropdownButton}
                onClick={() => setShowEquipmentPicker((current) => !current)}
              >
                {selectedBookingEquipmentIds.length} equipo(s) seleccionado(s) ▾
              </button>

              {showEquipmentPicker && (
                <div style={styles.dropdownPanel}>
                  <div style={styles.inlineButtons}>
                    <button type="button" style={styles.miniButton} onClick={selectAllBookingEquipment}>Seleccionar todos</button>
                    <button type="button" style={styles.miniButton} onClick={clearSelectedBookingEquipment}>Dejar solo uno</button>
                    <button type="button" style={styles.miniButton} onClick={() => setShowEquipmentPicker(false)}>Cerrar</button>
                  </div>
                  <div style={styles.checkboxListCompact}>
                    {equipment.map((item) => (
                      <label key={item.id} style={styles.checkboxItemCompact}>
                        <input type="checkbox" checked={selectedBookingEquipmentIds.includes(String(item.id))} onChange={() => toggleBookingEquipment(String(item.id))} />
                        <span><strong>{item.code}</strong> · {item.serial}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              <p style={styles.helpText}>Selecciona uno o varios equipos para la misma reserva.</p>
            </div>

            <label style={styles.field}>
              <span style={styles.label}>Cliente / responsable</span>
              <input style={styles.input} placeholder="Ej: Cliente ABC" value={newBooking.client} onChange={(event) => setNewBooking((current) => ({ ...current, client: event.target.value }))} />
            </label>

            <label style={styles.field}>
              <span style={styles.label}>Desde</span>
              <input style={styles.input} type="date" value={newBooking.startDate} onChange={(event) => setNewBooking((current) => ({ ...current, startDate: event.target.value }))} />
            </label>

            <label style={styles.field}>
              <span style={styles.label}>Hasta</span>
              <input style={styles.input} type="date" value={newBooking.endDate} onChange={(event) => setNewBooking((current) => ({ ...current, endDate: event.target.value }))} />
            </label>

            <button style={styles.primaryButton} onClick={addBooking}>Guardar reserva</button>
            <button style={styles.secondaryButton} onClick={resetDemoData}>Restaurar demo</button>

            <p style={styles.helpText}>El sistema permite reservar varios equipos a la vez y evita fechas cruzadas.</p>
          </section>
          </div>
        </main>

        <section style={styles.cardFullCompact}>
          <div style={styles.tableHeaderCompact}>
            <div>
              <h2 style={styles.sectionTitleSmall}>Estado físico de equipos</h2>
              <p style={styles.helpText}>Cambia rápidamente el estado físico antes de revisar disponibilidad.</p>
            </div>
          </div>

          <div style={styles.statusGrid}>
            {equipment.map((item) => (
              <div key={item.id} style={styles.statusItem}>
                <span style={styles.statusCode}>{item.code}</span>
                <select style={styles.statusSelect} value={item.status} onChange={(event) => updateEquipmentStatus(item.id, event.target.value)}>
                  {statusOptions.map((status) => <option key={status} value={status}>{status}</option>)}
                </select>
              </div>
            ))}
          </div>
        </section>

        <section style={styles.cardFull}>
          <div style={styles.tableHeader}>
            <div>
              <h2 style={styles.sectionTitle}>Estado de equipos en la fecha consultada</h2>
              <p style={styles.helpText}>Mostrando {filteredEquipmentStatus.length} de {equipment.length} equipos.</p>
            </div>
            <button style={styles.secondaryButton} onClick={exportToExcel}>Exportar resultado</button>
          </div>

          <div style={styles.tableWrap}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Código</th>
                  <th style={styles.th}>Tipo equipo</th>
                  <th style={styles.th}>Marca</th>
                  <th style={styles.th}>Modelo</th>
                  <th style={styles.th}>Serial</th>
                  <th style={styles.th}>Estado físico</th>
                  <th style={styles.th}>Disponibilidad</th>
                  <th style={styles.th}>Cliente / motivo</th>
                  <th style={styles.th}>Fechas de uso</th>
                  <th style={styles.th}>Disponible nuevamente</th>
                </tr>
              </thead>
              <tbody>
                {filteredEquipmentStatus.map((item) => (
                  <tr key={item.id}>
                    <td style={styles.td}>{item.code}</td>
                    <td style={styles.td}>{item.type}</td>
                    <td style={styles.td}>{item.brand}</td>
                    <td style={styles.td}>{item.model}</td>
                    <td style={styles.td}>{item.serial}</td>
                    <td style={styles.td}>{item.status}</td>
                    <td style={styles.td}><span style={{ ...styles.badge, ...(item.available ? styles.badgeAvailable : styles.badgeUnavailable) }}>{item.available ? "Disponible" : "No disponible"}</span></td>
                    <td style={styles.td}>{item.client || (item.blockedByStatus ? item.status : "")}</td>
                    <td style={styles.td}>{item.usageDates || ""}</td>
                    <td style={styles.td}>{item.availableFrom}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}

const styles = {
  page: { minHeight: "100vh", background: "#f8fafc", color: "#0f172a", fontFamily: "Arial, sans-serif", padding: "24px" },
  container: { maxWidth: "1500px", margin: "0 auto" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: "16px", marginBottom: "24px", flexWrap: "wrap" },
  actionsHeader: { display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap" },
  kicker: { margin: 0, color: "#64748b", fontSize: "14px", fontWeight: 700 },
  title: { margin: "4px 0", fontSize: "34px", lineHeight: 1.1 },
  subtitle: { margin: 0, color: "#475569", maxWidth: "760px" },
  counterCard: { background: "white", borderRadius: "18px", padding: "16px 22px", boxShadow: "0 8px 24px rgba(15, 23, 42, 0.08)" },
  availableCounterCard: { background: "#ecfdf5", border: "1px solid #a7f3d0", borderRadius: "18px", padding: "16px 22px", boxShadow: "0 8px 24px rgba(15, 23, 42, 0.08)" },
  unavailableCounterCard: { background: "#fef2f2", border: "1px solid #fecaca", borderRadius: "18px", padding: "16px 22px", boxShadow: "0 8px 24px rgba(15, 23, 42, 0.08)" },
  smallText: { margin: 0, color: "#64748b", fontSize: "14px" },
  counter: { margin: 0, fontSize: "28px", fontWeight: 800 },
  gridMain: { display: "grid", gridTemplateColumns: "2fr 1fr", gap: "24px", marginBottom: "24px" },
  cardLarge: { background: "white", borderRadius: "22px", padding: "24px", boxShadow: "0 8px 24px rgba(15, 23, 42, 0.08)" },
  card: { background: "white", borderRadius: "22px", padding: "20px", boxShadow: "0 8px 24px rgba(15, 23, 42, 0.08)", display: "flex", flexDirection: "column", gap: "12px" },
  cardCompact: { background: "white", borderRadius: "22px", padding: "16px", boxShadow: "0 8px 24px rgba(15, 23, 42, 0.08)", display: "flex", flexDirection: "column", gap: "10px" },
  sideColumn: { display: "flex", flexDirection: "column", gap: "16px" },
  cardFull: { background: "white", borderRadius: "22px", padding: "24px", boxShadow: "0 8px 24px rgba(15, 23, 42, 0.08)" },
  cardFullCompact: { background: "white", borderRadius: "22px", padding: "16px", boxShadow: "0 8px 24px rgba(15, 23, 42, 0.08)", marginBottom: "24px" },
  sectionTitle: { margin: "0 0 18px", fontSize: "22px" },
  sectionTitleSmall: { margin: "0 0 4px", fontSize: "18px" },
  tableHeader: { display: "flex", justifyContent: "space-between", gap: "16px", alignItems: "center", flexWrap: "wrap", marginBottom: "16px" },
  tableHeaderCompact: { display: "flex", justifyContent: "space-between", gap: "12px", alignItems: "center", flexWrap: "wrap", marginBottom: "12px" },
  formGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "18px" },
  formGridSingle: { display: "grid", gridTemplateColumns: "1fr", gap: "16px", marginBottom: "18px" },
  field: { display: "flex", flexDirection: "column", gap: "7px" },
  label: { fontSize: "14px", fontWeight: 700 },
  input: { width: "100%", boxSizing: "border-box", border: "1px solid #cbd5e1", borderRadius: "12px", padding: "11px 12px", fontSize: "15px", background: "white" },
  resultBox: { borderRadius: "18px", padding: "18px", border: "1px solid", marginBottom: "22px" },
  availableBox: { borderColor: "#a7f3d0", background: "#ecfdf5" },
  unavailableBox: { borderColor: "#fecaca", background: "#fef2f2" },
  resultTitle: { margin: "0 0 6px", fontSize: "22px" },
  resultText: { margin: "4px 0", color: "#334155" },
  block: { marginTop: "18px" },
  subTitle: { margin: "0 0 12px", fontSize: "18px" },
  emptyBox: { background: "#f1f5f9", borderRadius: "14px", padding: "14px", color: "#64748b" },
  list: { display: "flex", flexDirection: "column", gap: "10px" },
  bookingItem: { background: "#f1f5f9", borderRadius: "14px", padding: "12px", display: "flex", justifyContent: "space-between", alignItems: "center", gap: "12px" },
  bookingClient: { margin: 0, fontWeight: 700 },
  bookingDate: { margin: "4px 0 0", color: "#64748b", fontSize: "14px" },
  deleteButton: { border: 0, borderRadius: "10px", background: "#e2e8f0", padding: "8px 10px", cursor: "pointer" },
  primaryButton: { border: 0, borderRadius: "12px", background: "#0f172a", color: "white", padding: "12px 14px", cursor: "pointer", fontWeight: 800, fontSize: "15px" },
  secondaryButton: { border: "1px solid #cbd5e1", borderRadius: "12px", background: "white", color: "#0f172a", padding: "12px 14px", cursor: "pointer", fontWeight: 800, fontSize: "15px" },
  dangerButton: { border: 0, borderRadius: "12px", background: "#991b1b", color: "white", padding: "12px 14px", cursor: "pointer", fontWeight: 800, fontSize: "15px" },
  helpText: { margin: 0, color: "#64748b", fontSize: "13px" },
  checkboxList: { maxHeight: "260px", overflowY: "auto", border: "1px solid #cbd5e1", borderRadius: "12px", padding: "10px", background: "#ffffff", display: "flex", flexDirection: "column", gap: "8px" },
  checkboxItem: { display: "flex", alignItems: "flex-start", gap: "8px", fontSize: "13px", color: "#334155", cursor: "pointer" },
  dropdownButton: { width: "100%", border: "1px solid #cbd5e1", borderRadius: "12px", background: "white", padding: "11px 12px", cursor: "pointer", fontWeight: 800, textAlign: "left", color: "#0f172a" },
  dropdownPanel: { border: "1px solid #cbd5e1", borderRadius: "14px", padding: "10px", background: "#f8fafc", boxShadow: "0 8px 18px rgba(15, 23, 42, 0.08)" },
  checkboxListCompact: { maxHeight: "210px", overflowY: "auto", display: "grid", gridTemplateColumns: "1fr", gap: "6px", marginTop: "8px" },
  checkboxItemCompact: { display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", color: "#334155", cursor: "pointer", background: "white", border: "1px solid #e2e8f0", borderRadius: "10px", padding: "7px" },
  inlineButtons: { display: "flex", gap: "8px", flexWrap: "wrap" },
  miniButton: { border: "1px solid #cbd5e1", borderRadius: "10px", background: "#f8fafc", padding: "7px 10px", cursor: "pointer", fontWeight: 700, fontSize: "12px" },
  statusGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))", gap: "8px" },
  statusItem: { display: "flex", alignItems: "center", justifyContent: "space-between", gap: "8px", border: "1px solid #e2e8f0", borderRadius: "12px", padding: "8px", background: "#f8fafc" },
  statusCode: { fontWeight: 800, fontSize: "13px", color: "#0f172a" },
  statusSelect: { flex: 1, minWidth: "120px", border: "1px solid #cbd5e1", borderRadius: "10px", padding: "7px", fontSize: "12px", background: "white" },
  tableWrap: { width: "100%", overflowX: "auto", border: "1px solid #e2e8f0", borderRadius: "16px" },
  table: { width: "100%", borderCollapse: "collapse", minWidth: "1180px", background: "white" },
  th: { background: "#0f172a", color: "white", padding: "12px", textAlign: "left", fontSize: "14px", borderBottom: "1px solid #e2e8f0" },
  td: { padding: "11px 12px", borderBottom: "1px solid #e2e8f0", fontSize: "14px", color: "#334155" },
  tableSelect: { width: "150px", border: "1px solid #cbd5e1", borderRadius: "10px", padding: "8px", fontSize: "13px", background: "white" },
  badge: { borderRadius: "999px", padding: "5px 9px", fontSize: "12px", fontWeight: 800, display: "inline-block" },
  badgeAvailable: { background: "#dcfce7", color: "#166534" },
  badgeUnavailable: { background: "#fee2e2", color: "#991b1b" },
};
