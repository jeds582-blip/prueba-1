import React, { useEffect, useMemo, useState } from "react";

const initialEquipment = Array.from({ length: 25 }, (_, i) => ({
  id: i + 1,
  name: `Equipo ${String(i + 1).padStart(2, "0")}`,
  serial: `SER-${2026}-${String(i + 1).padStart(4, "0")}`,
  type: i % 3 === 0 ? "Computador" : i % 3 === 1 ? "Tablet" : "Impresora",
}));

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

export default function AppDisponibilidadEquipos() {
  const [equipment] = useState(initialEquipment);
  const [bookings, setBookings] = useState(() => {
    const savedBookings = localStorage.getItem("bookings");
    return savedBookings ? JSON.parse(savedBookings) : initialBookings;
  });

  useEffect(() => {
    localStorage.setItem("bookings", JSON.stringify(bookings));
  }, [bookings]);

  const [selectedEquipmentId, setSelectedEquipmentId] = useState("1");
  const [checkDate, setCheckDate] = useState("2026-05-18");

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

    return {
      available: !conflict,
      conflict,
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

      return {
        ...item,
        available: !conflict,
        client: conflict?.client || "",
      };
    });
  }, [equipment, bookings, checkDate]);

  function addBooking() {
    if (!newBooking.client || !newBooking.startDate || !newBooking.endDate) {
      alert("Completa cliente, fecha inicial y fecha final.");
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

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <header style={styles.header}>
          <div>
            <p style={styles.kicker}>MVP inicial</p>
            <h1 style={styles.title}>Disponibilidad de equipos</h1>
            <p style={styles.subtitle}>
              Consulta si uno de tus 25 equipos está disponible en una fecha específica y registra reservas por cliente.
            </p>
          </div>
          <div style={styles.counterCard}>
            <p style={styles.smallText}>Equipos registrados</p>
            <p style={styles.counter}>{equipment.length}</p>
          </div>
        </header>

        <main style={styles.gridMain}>
          <section style={styles.cardLarge}>
            <h2 style={styles.sectionTitle}>Consultar disponibilidad</h2>

            <div style={styles.formGrid}>
              <label style={styles.field}>
                <span style={styles.label}>Equipo / serial</span>
                <select
                  style={styles.input}
                  value={selectedEquipmentId}
                  onChange={(event) => setSelectedEquipmentId(event.target.value)}
                >
                  {equipment.map((item) => (
                    <option key={item.id} value={String(item.id)}>
                      {item.name} - {item.serial}
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
                  {selectedEquipment.name} - Serial {selectedEquipment.serial} - {selectedEquipment.type}
                </p>
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
                    {item.name} - {item.serial}
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

            <p style={styles.helpText}>
              El sistema evita registrar reservas cruzadas para el mismo equipo.
            </p>
          </section>
        </main>

        <section style={styles.cardFull}>
          <h2 style={styles.sectionTitle}>Estado de todos los equipos en la fecha consultada</h2>
          <div style={styles.equipmentGrid}>
            {allEquipmentStatus.map((item) => (
              <div key={item.id} style={styles.equipmentCard}>
                <div style={styles.equipmentTop}>
                  <span style={styles.equipmentIcon}>💻</span>
                  <span
                    style={{
                      ...styles.badge,
                      ...(item.available ? styles.badgeAvailable : styles.badgeUnavailable),
                    }}
                  >
                    {item.available ? "Disponible" : "Ocupado"}
                  </span>
                </div>
                <p style={styles.equipmentName}>{item.name}</p>
                <p style={styles.equipmentMeta}>{item.serial}</p>
                <p style={styles.equipmentMeta}>{item.type}</p>
                {!item.available && <p style={styles.clientText}>Cliente: {item.client}</p>}
              </div>
            ))}
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
    maxWidth: "1200px",
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
    maxWidth: "680px",
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
  helpText: {
    margin: 0,
    color: "#64748b",
    fontSize: "13px",
  },
  equipmentGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
    gap: "14px",
  },
  equipmentCard: {
    border: "1px solid #e2e8f0",
    borderRadius: "18px",
    padding: "16px",
    background: "#ffffff",
  },
  equipmentTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "12px",
  },
  equipmentIcon: {
    fontSize: "20px",
  },
  badge: {
    borderRadius: "999px",
    padding: "5px 9px",
    fontSize: "12px",
    fontWeight: 800,
  },
  badgeAvailable: {
    background: "#dcfce7",
    color: "#166534",
  },
  badgeUnavailable: {
    background: "#fee2e2",
    color: "#991b1b",
  },
  equipmentName: {
    margin: 0,
    fontWeight: 800,
  },
  equipmentMeta: {
    margin: "4px 0 0",
    color: "#64748b",
    fontSize: "13px",
  },
  clientText: {
    margin: "10px 0 0",
    color: "#334155",
    fontSize: "13px",
  },
};
