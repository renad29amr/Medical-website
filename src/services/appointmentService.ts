// import mongoose from "mongoose";
// import Appointment, { AppointmentStatus } from "../models/Appointment";
// import User, { UserRole } from "../models/User";

// interface CreateAppointmentData {
//   patient: string;
//   doctor: string;
//   appointmentDate: Date;
//   timeSlot: string;
//   notes?: string;
// }

// class AppointmentService {
//   async createAppointment(data: CreateAppointmentData) {
//     const { patient, doctor, appointmentDate, timeSlot, notes } = data;

//     const patientUser = await User.findById(patient);
//     if (!patientUser) throw new Error("Patient not found");
//     if (patientUser.role !== UserRole.PATIENT) throw new Error("Only patients can book appointments");

//     const doctorUser = await User.findById(doctor);
//     if (!doctorUser) throw new Error("Doctor not found");
//     if (doctorUser.role !== UserRole.DOCTOR) throw new Error("Selected user is not a doctor");

//     if (new Date(appointmentDate) <= new Date()) {
//       throw new Error("Appointment must be in the future");
//     }

//     const existingAppointment = await Appointment.findOne({
//       patient,
//       doctor,
//       appointmentDate,
//       timeSlot,
//       status: { $ne: AppointmentStatus.CANCELLED },
//     });

//     if (existingAppointment) {
//       throw new Error("You already have an appointment with this doctor at this time");
//     }

//     const doctorHasAppointment = await Appointment.findOne({
//       doctor,
//       appointmentDate,
//       timeSlot,
//       status: { $in: [AppointmentStatus.PENDING, AppointmentStatus.CONFIRMED] },
//     });

//     if (doctorHasAppointment) {
//       throw new Error("Doctor already has an appointment at this time");
//     }

//     return Appointment.create({
//       patient,
//       doctor,
//       appointmentDate,
//       timeSlot,
//       status: AppointmentStatus.PENDING,
//       notes,
//     });
//   }

//   async getPatientAppointments(patientId: string, filters?: { status?: string; date?: string }) {
//     const query: any = { patient: patientId };
//     if (filters?.status) query.status = filters.status;
//     if (filters?.date) {
//       const start = new Date(filters.date);
//       const end = new Date(filters.date);
//       end.setDate(end.getDate() + 1);
//       query.appointmentDate = { $gte: start, $lt: end };
//     }

//     return Appointment.find(query).populate("doctor", "fullName email").sort({ appointmentDate: 1 });
//   }

//   async getDoctorAppointments(doctorId: string, filters?: { status?: string; date?: string }) {
//     const query: any = { doctor: doctorId };
//     if (filters?.status) query.status = filters.status;
//     if (filters?.date) {
//       const start = new Date(filters.date);
//       const end = new Date(filters.date);
//       end.setDate(end.getDate() + 1);
//       query.appointmentDate = { $gte: start, $lt: end };
//     }

//     return Appointment.find(query).populate("patient", "fullName email").sort({ appointmentDate: 1 });
//   }

//   async cancelAppointment(appointmentId: string, userId: string, role: string) {
//     if (!mongoose.Types.ObjectId.isValid(appointmentId)) throw new Error("Invalid appointment ID");

//     const appointment = await Appointment.findById(appointmentId);
//     if (!appointment) throw new Error("Appointment not found");

//     if (role === "patient") {
//       if (appointment.patient.toString() !== userId) throw new Error("You can only cancel your own appointments");
//       if (appointment.status === AppointmentStatus.COMPLETED) throw new Error("Completed appointments cannot be cancelled");
//       if (appointment.status === AppointmentStatus.CANCELLED) throw new Error("Appointment is already cancelled");

//       const appointmentDateTime = this.getAppointmentDateTime(appointment.appointmentDate, appointment.timeSlot);
//       if (new Date() >= appointmentDateTime) {
//         throw new Error("Patients cannot cancel an appointment after its scheduled time");
//       }
//     }

//     if (role === "doctor") {
//       if (appointment.doctor.toString() !== userId) throw new Error("You can only cancel your own appointments");
//       if (appointment.status === AppointmentStatus.COMPLETED) throw new Error("Completed appointments cannot be cancelled");
//       if (appointment.status === AppointmentStatus.CANCELLED) throw new Error("Appointment is already cancelled");
//     }

//     appointment.status = AppointmentStatus.CANCELLED;
//     await appointment.save();
//     return appointment;
//   }

//   async confirmAppointment(appointmentId: string, doctorId: string) {
//     const appointment = await Appointment.findById(appointmentId);
//     if (!appointment) throw new Error("Appointment not found");
//     if (appointment.doctor.toString() !== doctorId) throw new Error("You can only manage your own appointments");
//     if (appointment.status !== AppointmentStatus.PENDING) throw new Error("Only pending appointments can be confirmed");

//     appointment.status = AppointmentStatus.CONFIRMED;
//     await appointment.save();
//     return appointment;
//   }

//   async completeAppointment(appointmentId: string, doctorId: string) {
//     const appointment = await Appointment.findById(appointmentId);
//     if (!appointment) throw new Error("Appointment not found");
//     if (appointment.doctor.toString() !== doctorId) throw new Error("You can only manage your own appointments");
//     if (appointment.status !== AppointmentStatus.CONFIRMED) throw new Error("Only confirmed appointments can be completed");

//     appointment.status = AppointmentStatus.COMPLETED;
//     await appointment.save();
//     return appointment;
//   }

//   private getAppointmentDateTime(date: Date, timeSlot: string): Date {
//     const appointmentDateTime = new Date(date);
//     const timeMatch = timeSlot.match(/(\d{1,2}):(\d{2})/);
//     if (timeMatch) {
//       appointmentDateTime.setHours(Number(timeMatch[1]), Number(timeMatch[2]), 0, 0);
//     }
//     return appointmentDateTime;
//   }
// }

// export default new AppointmentService();

import mongoose from "mongoose";
import Appointment, {
  AppointmentStatus,
} from "../models/Appointment";
import { Schedule } from "../models/Schedule";

interface CreateAppointmentData {
  patient: string;
  doctor: string;
  appointmentDate: Date;
  timeSlot: string;
  notes?: string;
}

class AppointmentService {
  async createAppointment(data: CreateAppointmentData) {
    const {
      patient,
      doctor,
      appointmentDate,
      timeSlot,
      notes,
    } = data;

    // Appointment must be in the future
    if (new Date(appointmentDate) <= new Date()) {
      throw new Error("Appointment must be in the future");
    }

    // Get the day of the week
    const day = appointmentDate.toLocaleDateString("en-US", {
      weekday: "long",
    });

    // Find the doctor's schedule for this day
    const schedule = await Schedule.findOne({
      doctor,
      day,
      availability: true,
    });

    if (!schedule) {
      throw new Error(
        "Doctor is not available on this day"
      );
    }

    // timeSlot format: "09:00-09:30"
    const [requestedStart, requestedEnd] =
      timeSlot.split("-");

    // Check if the requested time slot exists
    // in the doctor's available time slots
    const slotExists = schedule.availableTimeSlots.some(
      (slot) =>
        slot.start === requestedStart &&
        slot.end === requestedEnd
    );

    if (!slotExists) {
      throw new Error(
        "The selected time slot is not available"
      );
    }

    // Check if the patient already has
    // an appointment with this doctor at this time
    const existingAppointment = await Appointment.findOne({
      patient,
      doctor,
      appointmentDate,
      timeSlot,
      status: {
        $ne: AppointmentStatus.CANCELLED,
      },
    });

    if (existingAppointment) {
      throw new Error(
        "You already have an appointment with this doctor at this time"
      );
    }

    // Check if the doctor already has
    // an appointment at this time
    const doctorHasAppointment = await Appointment.findOne({
      doctor,
      appointmentDate,
      timeSlot,
      status: {
        $in: [
          AppointmentStatus.PENDING,
          AppointmentStatus.CONFIRMED,
        ],
      },
    });

    if (doctorHasAppointment) {
      throw new Error(
        "Doctor already has an appointment at this time"
      );
    }

    // Create appointment
    const appointment = await Appointment.create({
      patient,
      doctor,
      appointmentDate,
      timeSlot,
      status: AppointmentStatus.PENDING,
      notes,
    });

    return appointment;
  }

  async getPatientAppointments(
    patientId: string,
    filters?: {
      status?: string;
      date?: string;
    }
  ) {
    const query: any = {
      patient: patientId,
    };

    if (filters?.status) {
      query.status = filters.status;
    }

    if (filters?.date) {
      const start = new Date(filters.date);
      const end = new Date(filters.date);

      end.setDate(end.getDate() + 1);

      query.appointmentDate = {
        $gte: start,
        $lt: end,
      };
    }

    return Appointment.find(query)
      .populate("doctor", "fullName email")
      .sort({ appointmentDate: 1 });
  }

  async getDoctorAppointments(
    doctorId: string,
    filters?: {
      status?: string;
      date?: string;
    }
  ) {
    const query: any = {
      doctor: doctorId,
    };

    if (filters?.status) {
      query.status = filters.status;
    }

    if (filters?.date) {
      const start = new Date(filters.date);
      const end = new Date(filters.date);

      end.setDate(end.getDate() + 1);

      query.appointmentDate = {
        $gte: start,
        $lt: end,
      };
    }

    return Appointment.find(query)
      .populate("patient", "fullName email")
      .sort({ appointmentDate: 1 });
  }

  async cancelAppointment(
    appointmentId: string,
    userId: string,
    role: string
  ) {
    if (!mongoose.Types.ObjectId.isValid(appointmentId)) {
      throw new Error("Invalid appointment ID");
    }

    const appointment = await Appointment.findById(
      appointmentId
    );

    if (!appointment) {
      throw new Error("Appointment not found");
    }

    // Patient cancellation
    if (role === "Patient") {
      if (appointment.patient.toString() !== userId) {
        throw new Error(
          "You can only cancel your own appointments"
        );
      }

      if (
        appointment.status === AppointmentStatus.COMPLETED
      ) {
        throw new Error(
          "Completed appointments cannot be cancelled"
        );
      }

      if (
        appointment.status === AppointmentStatus.CANCELLED
      ) {
        throw new Error("Appointment is already cancelled");
      }

      const appointmentDateTime =
        this.getAppointmentDateTime(
          appointment.appointmentDate,
          appointment.timeSlot
        );

      if (new Date() >= appointmentDateTime) {
        throw new Error(
          "Patients cannot cancel an appointment after its scheduled time"
        );
      }
    }

    // Doctor cancellation
    if (role === "Doctor") {
      if (appointment.doctor.toString() !== userId) {
        throw new Error(
          "You can only cancel your own appointments"
        );
      }

      if (
        appointment.status === AppointmentStatus.COMPLETED
      ) {
        throw new Error(
          "Completed appointments cannot be cancelled"
        );
      }

      if (
        appointment.status === AppointmentStatus.CANCELLED
      ) {
        throw new Error("Appointment is already cancelled");
      }
    }

    appointment.status = AppointmentStatus.CANCELLED;

    await appointment.save();

    return appointment;
  }

  async confirmAppointment(
    appointmentId: string,
    doctorId: string
  ) {
    const appointment = await Appointment.findById(
      appointmentId
    );

    if (!appointment) {
      throw new Error("Appointment not found");
    }

    if (appointment.doctor.toString() !== doctorId) {
      throw new Error(
        "You can only manage your own appointments"
      );
    }

    if (
      appointment.status !== AppointmentStatus.PENDING
    ) {
      throw new Error(
        "Only pending appointments can be confirmed"
      );
    }

    appointment.status = AppointmentStatus.CONFIRMED;

    await appointment.save();

    return appointment;
  }

  async completeAppointment(
    appointmentId: string,
    doctorId: string
  ) {
    const appointment = await Appointment.findById(
      appointmentId
    );

    if (!appointment) {
      throw new Error("Appointment not found");
    }

    if (appointment.doctor.toString() !== doctorId) {
      throw new Error(
        "You can only manage your own appointments"
      );
    }

    if (
      appointment.status !== AppointmentStatus.CONFIRMED
    ) {
      throw new Error(
        "Only confirmed appointments can be completed"
      );
    }

    const appointmentDateTime =
      this.getAppointmentDateTime(
        appointment.appointmentDate,
        appointment.timeSlot
      );

    if (new Date() < appointmentDateTime) {
      throw new Error(
        "Appointment cannot be completed before its scheduled time"
      );
    }

    appointment.status = AppointmentStatus.COMPLETED;

    await appointment.save();

    return appointment;
  }

  // Convert appointment date + time slot
  // into the exact appointment DateTime
  private getAppointmentDateTime(
    date: Date,
    timeSlot: string
  ): Date {
    const [startTime] = timeSlot.split("-");

    const [hours, minutes] = startTime
      .split(":")
      .map(Number);

    const result = new Date(date);

    result.setHours(hours, minutes, 0, 0);

    return result;
  }
}

export default new AppointmentService();
