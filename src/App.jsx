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
  {
    id: 1,
    equipmentId: 1,
    client: "Cliente A",
    startDate: "2026-05-15",
    endDate: "2026-05-20",
  },
  {
    id: 2,
    equipmentId: 3,
    client: "Cliente B",
    startDate: "2026-05-18",
    endDate: "2026-05-25",
  },
];

function isDateBetween(date, start, end) {
  return date >= start && date <= end;
}

function downloadCsv(filename, rows) {
  const csvContent = rows.map((row) =>
    row
      .map((cell) => `"${String(cell ?? "").replaceAll('"', '""')}"`)
      .join(",")
  ).join("\n");

  const blob = new Blob(["\ufeff" + csvContent], {
    type: "text/csv;charset=utf-8;",
  });

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

  useEffect(() => {
    localStorage.setItem("equipment", JSON.stringify(equipment));
  }, [equipment]);

  useEffect(() => {
    localStorage.setItem("bookings", JSON.stringify(bookings));
  }, [bookings]);

  const [selectedEquipmentId, setSelectedEquipmentId] = useState("1");
  const [checkDate, setCheckDate] = useState("2026-05-18");
  const [searchText, setSearchText] = useState("");

  const [newBooking, setNewBooking] = useState({
    equipmentId: "1",
    client: "",
    startDate: "",
    endDate: "",
  });

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
      const conflict = bookings.find(
        (booking) =>
          booking.equipmentId === item.id &&
          isDateBetween(checkDate, booking.startDate, booking.endDate)
      );

      const statusBlocksAvailability = item.status !== "Disponible";

      return {
        ...item,
        available: !conflict && !statusBlocksAvailability,
        client: conflict?.client || "",
        blockedByStatus: statusBlocksAvailability,
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

  function addBooking() {
    const equipmentToBook = equipment.find((item) => item.id === Number(newBooking.equipmentId));

    if (!newBooking.client || !newBooking.startDate || !newBooking.endDate) {
      alert("Completa cliente, fecha inicial y fecha final.");
      return;
    }

    if (!equipmentToBook) {
      alert("Selecciona un equipo válido.");
      return;
    }

    if (equipmentToBook.status !== "Disponible") {
      alert(`No puedes reservar este equipo porque su estado es: ${equipmentToBook.status}.`);
      return;
    }

    if (newBooking.endDate < newBooking.startDate) {
      alert("La fecha final no puede ser menor que la fecha inicial.");
      return;
    }

    const hasOverlap = bookings.some((booking) => {
      if (booking.equipmentId !== Number(newBooking.equipmentId)) return false;

      return (
        newBooking.startDate <= booking.endDate &&
        newBooking.endDate >= booking.startDate
      );
    });

    if (hasOverlap) {
      alert("Este equipo ya tiene una reserva que cruza con esas fechas.");
      return;
    }

    setBookings((current) => [
      ...current,
      {
        id: Date.now(),
        equipmentId: Number(newBooking.equipmentId),
        client: newBooking.client,
        startDate: newBooking.startDate,
        endDate: newBooking.endDate,
      },
    ]);

    setNewBooking({
      equipmentId: newBooking.equipmentId,
      client: "",
      startDate: "",
      endDate: "",
    });
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
    setEquipment((current) =>
      current.map((item) =>
        item.id === equipmentId ? { ...item, status } : item
      )
    );
  }

  function resetDemoData() {
    const confirmed = window.confirm("¿Quieres restaurar equipos y reservas de ejemplo? Se perderán los cambios guardados en este navegador.");
    if (!confirmed) return;
    setEquipment(initialEquipment);
    setBookings(initialBookings);
    setSelectedEquipmentId("1");
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
        checkDate,
      ]),
      [],
      ["Reservas registradas"],
      ["Código interno", "Serial", "Marca", "Modelo", "Cliente", "Desde", "Hasta"],
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
        ];
      }),
    ];

    downloadCsv(`disponibilidad-equipos-${checkDate || "reporte"}.csv`, rows);
  }

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <header style={styles.header}>
          <div>
            <p style={styles.kicker}>MVP inicial</p>
            <h1 style={styles.title}>Disponibilidad de equipos</h1>
            <p style={styles.subtitle}>
              Consulta si uno de tus analizadores de CO está disponible en una fecha específica y registra reservas por cliente.
            </p>
          </div>
          <div style={styles.actionsHeader}>
            <div style={styles.counterCard}>
              <p style={styles.smallText}>Equipos registrados</p>
              <p style={styles.counter}>{equipment.length}</p>
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
                <select
                  style={styles.input}
                  value={selectedEquipmentId}
                  onChange={(event) => setSelectedEquipmentId(event.target.value)}
                >
                  {equipment.map((item) => (
                    <option key={item.id} value={String(item.id)}>
                      {item.code} - {item.brand} {item.model} - Serial {item.serial}
                    </option>
                  ))}
                </select>
              </label>

              <label style={styles.field}>
                <span style={styles.label}>Fecha a consultar</span>
                <input
                  style={styles.input}
                  type="date"
                  value={checkDate}
                  onChange={(event) => setCheckDate(event.target.value)}
                />
              </label>
            </div>

            {selectedEquipment && (
              <div style={styles.formGrid}>
                <label style={styles.field}>
                  <span style={styles.label}>Estado físico del equipo</span>
                  <select
                    style={styles.input}
                    value={selectedEquipment.status}
                    onChange={(event) => updateEquipmentStatus(selectedEquipment.id, event.target.value)}
                  >
                    <option value="Disponible">Disponible</option>
                    <option value="Mantenimiento">Mantenimiento</option>
                    <option value="Dañado">Dañado</option>
                    <option value="Fuera de servicio">Fuera de servicio</option>
                  </select>
                </label>
                <label style={styles.field}>
                  <span style={styles.label}>Buscar por serial, código, marca o modelo</span>
                  <input
                    style={styles.input}
                    placeholder="Ej: CO-005, TTGS63AN, HORIBA..."
                    value={searchText}
                    onChange={(event) => setSearchText(event.target.value)}
                  />
                </label>
              </div>
            )}

            {selectedEquipment && availability && (
              <div
                style={{
                  ...styles.resultBox,
                  ...(availability.available ? styles.availableBox : styles.unavailableBox),
                }}
              >
                <h3 style={styles.resultTitle}>
                  {availability.available ? "Disponible" : "No disponible"}
                </h3>
                <p style={styles.resultText}>
                  <strong>{selectedEquipment.code}</strong> - {selectedEquipment.type}
                </p>
                <p style={styles.resultText}>
                  {selectedEquipment.brand} {selectedEquipment.model} - Serial {selectedEquipment.serial}
                </p>
                <p style={styles.resultText}>
                  Estado físico: <strong>{selectedEquipment.status}</strong>
                </p>
                {availability.statusBlocksAvailability && (
                  <p style={styles.resultText}>
                    Este equipo no se puede reservar porque está marcado como <strong>{selectedEquipment.status}</strong>.
                  </p>
                )}
                {!availability.available && availability.conflict && (
                  <p style={styles.resultText}>
                    Está asignado a <strong>{availability.conflict.client}</strong> desde {availability.conflict.startDate} hasta {availability.conflict.endDate}.
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
                        <p style={styles.bookingDate}>{booking.startDate} a {booking.endDate}</p>
                      </div>
                      <button style={styles.deleteButton} onClick={() => deleteBooking(booking.id)}>
                        Eliminar
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>

          <section style={styles.card}>
            <h2 style={styles.sectionTitle}>Registrar reserva</h2>

            <label style={styles.field}>
              <span style={styles.label}>Equipo</span>
              <select
                style={styles.input}
                value={newBooking.equipmentId}
                onChange={(event) =>
                  setNewBooking((current) => ({ ...current, equipmentId: event.target.value }))
                }
              >
                {equipment.map((item) => (
                  <option key={item.id} value={String(item.id)}>
                    {item.code} - {item.brand} {item.model}
                  </option>
                ))}
              </select>
            </label>

            <label style={styles.field}>
              <span style={styles.label}>Cliente / responsable</span>
              <input
                style={styles.input}
                placeholder="Ej: Cliente ABC"
                value={newBooking.client}
                onChange={(event) =>
                  setNewBooking((current) => ({ ...current, client: event.target.value }))
                }
              />
            </label>

            <label style={styles.field}>
              <span style={styles.label}>Desde</span>
              <input
                style={styles.input}
                type="date"
                value={newBooking.startDate}
                onChange={(event) =>
                  setNewBooking((current) => ({ ...current, startDate: event.target.value }))
                }
              />
            </label>

            <label style={styles.field}>
              <span style={styles.label}>Hasta</span>
              <input
                style={styles.input}
                type="date"
                value={newBooking.endDate}
                onChange={(event) =>
                  setNewBooking((current) => ({ ...current, endDate: event.target.value }))
                }
              />
            </label>

            <button style={styles.primaryButton} onClick={addBooking}>
              Guardar reserva
            </button>

            <button style={styles.secondaryButton} onClick={resetDemoData}>
              Restaurar demo
            </button>

            <p style={styles.helpText}>
              El sistema evita registrar reservas cruzadas para el mismo equipo y bloquea equipos en mantenimiento, dañados o fuera de servicio.
            </p>
          </section>
        </main>

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
                    <td style={styles.td}>
                      <span
                        style={{
                          ...styles.badge,
                          ...(item.available ? styles.badgeAvailable : styles.badgeUnavailable),
                        }}
                      >
                        {item.available ? "Disponible" : "No disponible"}
                      </span>
                    </td>
                    <td style={styles.td}>{item.client || (item.blockedByStatus ? item.status : "")}</td>
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
  page: {
    minHeight: "100vh",
    background: "#f8fafc",
    color: "#0f172a",
    fontFamily: "Arial, sans-serif",
    padding: "24px",
  },
  container: {
    maxWidth: "1400px",
    margin: "0 auto",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-end",
    gap: "16px",
    marginBottom: "24px",
    flexWrap: "wrap",
  },
  actionsHeader: {
    display: "flex",
    gap: "10px",
    alignItems: "center",
    flexWrap: "wrap",
  },
  kicker: {
    margin: 0,
    color: "#64748b",
    fontSize: "14px",
    fontWeight: 700,
  },
  title: {
    margin: "4px 0",
    fontSize: "34px",
    lineHeight: 1.1,
  },
  subtitle: {
    margin: 0,
    color: "#475569",
    maxWidth: "760px",
  },
  counterCard: {
    background: "white",
    borderRadius: "18px",
    padding: "16px 22px",
    boxShadow: "0 8px 24px rgba(15, 23, 42, 0.08)",
  },
  smallText: {
    margin: 0,
    color: "#64748b",
    fontSize: "14px",
  },
  counter: {
    margin: 0,
    fontSize: "28px",
    fontWeight: 800,
  },
  gridMain: {
    display: "grid",
    gridTemplateColumns: "2fr 1fr",
    gap: "24px",
    marginBottom: "24px",
  },
  cardLarge: {
    background: "white",
    borderRadius: "22px",
    padding: "24px",
    boxShadow: "0 8px 24px rgba(15, 23, 42, 0.08)",
  },
  card: {
    background: "white",
    borderRadius: "22px",
    padding: "24px",
    boxShadow: "0 8px 24px rgba(15, 23, 42, 0.08)",
    display: "flex",
    flexDirection: "column",
    gap: "14px",
  },
  cardFull: {
    background: "white",
    borderRadius: "22px",
    padding: "24px",
    boxShadow: "0 8px 24px rgba(15, 23, 42, 0.08)",
  },
  sectionTitle: {
    margin: "0 0 18px",
    fontSize: "22px",
  },
  tableHeader: {
    display: "flex",
    justifyContent: "space-between",
    gap: "16px",
    alignItems: "center",
    flexWrap: "wrap",
    marginBottom: "16px",
  },
  formGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "16px",
    marginBottom: "18px",
  },
  field: {
    display: "flex",
    flexDirection: "column",
    gap: "7px",
  },
  label: {
    fontSize: "14px",
    fontWeight: 700,
  },
  input: {
    width: "100%",
    boxSizing: "border-box",
    border: "1px solid #cbd5e1",
    borderRadius: "12px",
    padding: "11px 12px",
    fontSize: "15px",
    background: "white",
  },
  resultBox: {
    borderRadius: "18px",
    padding: "18px",
    border: "1px solid",
    marginBottom: "22px",
  },
  availableBox: {
    borderColor: "#a7f3d0",
    background: "#ecfdf5",
  },
  unavailableBox: {
    borderColor: "#fecaca",
    background: "#fef2f2",
  },
  resultTitle: {
    margin: "0 0 6px",
    fontSize: "22px",
  },
  resultText: {
    margin: "4px 0",
    color: "#334155",
  },
  block: {
    marginTop: "18px",
  },
  subTitle: {
    margin: "0 0 12px",
    fontSize: "18px",
  },
  emptyBox: {
    background: "#f1f5f9",
    borderRadius: "14px",
    padding: "14px",
    color: "#64748b",
  },
  list: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  bookingItem: {
    background: "#f1f5f9",
    borderRadius: "14px",
    padding: "12px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "12px",
  },
  bookingClient: {
    margin: 0,
    fontWeight: 700,
  },
  bookingDate: {
    margin: "4px 0 0",
    color: "#64748b",
    fontSize: "14px",
  },
  deleteButton: {
    border: 0,
    borderRadius: "10px",
    background: "#e2e8f0",
    padding: "8px 10px",
    cursor: "pointer",
  },
  primaryButton: {
    border: 0,
    borderRadius: "12px",
    background: "#0f172a",
    color: "white",
    padding: "12px 14px",
    cursor: "pointer",
    fontWeight: 800,
    fontSize: "15px",
  },
  secondaryButton: {
    border: "1px solid #cbd5e1",
    borderRadius: "12px",
    background: "white",
    color: "#0f172a",
    padding: "12px 14px",
    cursor: "pointer",
    fontWeight: 800,
    fontSize: "15px",
  },
  dangerButton: {
    border: 0,
    borderRadius: "12px",
    background: "#991b1b",
    color: "white",
    padding: "12px 14px",
    cursor: "pointer",
    fontWeight: 800,
    fontSize: "15px",
  },
  helpText: {
    margin: 0,
    color: "#64748b",
    fontSize: "13px",
  },
  tableWrap: {
    width: "100%",
    overflowX: "auto",
    border: "1px solid #e2e8f0",
    borderRadius: "16px",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    minWidth: "1100px",
    background: "white",
  },
  th: {
    background: "#0f172a",
    color: "white",
    padding: "12px",
    textAlign: "left",
    fontSize: "14px",
    borderBottom: "1px solid #e2e8f0",
  },
  td: {
    padding: "11px 12px",
    borderBottom: "1px solid #e2e8f0",
    fontSize: "14px",
    color: "#334155",
  },
  badge: {
    borderRadius: "999px",
    padding: "5px 9px",
    fontSize: "12px",
    fontWeight: 800,
    display: "inline-block",
  },
  badgeAvailable: {
    background: "#dcfce7",
    color: "#166534",
  },
  badgeUnavailable: {
    background: "#fee2e2",
    color: "#991b1b",
  },
};
