// import { Request, Response } from "express";
// import appointmentService from "../services/appointmentService";
// import { DoctorProfile } from "../models/DoctorProfile";


// class AppointmentController {
//   async createAppointment(req: Request, res: Response) {
//     try {
//       const patientId = req.user!.id;
//       const { doctor, appointmentDate, timeSlot, notes } = req.body;
//       const appointment = await appointmentService.createAppointment({
//         patient: patientId,
//         doctor,
//         appointmentDate: new Date(appointmentDate),
//         timeSlot,
//         notes,
//       });

//       return res.status(201).json({ success: true, message: "Appointment booked successfully", appointment });
//     } catch (error: any) {
//       return res.status(400).json({ success: false, message: error.message });
//     }
//   }

//   async getAppointments(req: Request, res: Response) {
//     try {
//       const patientId = req.user!.id;
//       const { status, date } = req.query;
//       const appointments = await appointmentService.getPatientAppointments(patientId, {
//         status: status as string,
//         date: date as string,
//       });

//       return res.status(200).json({ success: true, count: appointments.length, appointments });
//     } catch (error: any) {
//       return res.status(400).json({ success: false, message: error.message });
//     }
//   }

//   async getDoctorAppointments(
//   req: Request,
//   res: Response
// ) {
//   try {
//     // Find the DoctorProfile belonging to the logged-in user
//     const doctorProfile = await DoctorProfile.findOne({
//       user: req.user!.id,
//     });

//     if (!doctorProfile) {
//       res.status(404).json({
//         message: "Doctor profile not found.",
//       });
//       return;
//     }

//     const { status, date } = req.query;

//     const appointments =
//       await appointmentService.getDoctorAppointments(
//         doctorProfile._id.toString(),
//         {
//           status: status as string | undefined,
//           date: date as string | undefined,
//         }
//       );

//     res.status(200).json({
//       count: appointments.length,
//       appointments,
//     });
//   } catch (error) {
//     console.error("Get doctor appointments error:", error);

//     res.status(500).json({
//       message: "Failed to fetch doctor appointments.",
//       error,
//     });
//   }
// }

//   async cancelAppointment(req: Request, res: Response) {
//     try {
//       const appointmentId = req.params.id as string;
//       const userId = req.user!.id;
//       const role = req.user!.role;
//       const appointment = await appointmentService.cancelAppointment(appointmentId, userId, role);
//       return res.status(200).json({ success: true, message: "Appointment cancelled successfully", appointment });
//     } catch (error: any) {
//       return res.status(400).json({ success: false, message: error.message });
//     }
//   }

//   async confirmAppointment(req: Request, res: Response) {
//     try {
//       const appointmentId = req.params.id as string;
//       const doctorId = req.user!.id;
//       const appointment = await appointmentService.confirmAppointment(appointmentId, doctorId);
//       return res.status(200).json({ success: true, message: "Appointment confirmed successfully", appointment });
//     } catch (error: any) {
//       return res.status(400).json({ success: false, message: error.message });
//     }
//   }

//   async completeAppointment(req: Request, res: Response) {
//     try {
//       const appointmentId = req.params.id as string;
//       const doctorId = req.user!.id;
//       const appointment = await appointmentService.completeAppointment(appointmentId, doctorId);
//       return res.status(200).json({ success: true, message: "Appointment completed successfully", appointment });
//     } catch (error: any) {
//       return res.status(400).json({ success: false, message: error.message });
//     }
//   }
// }

// export default new AppointmentController();


import { Request, Response } from "express";
import appointmentService from "../services/appointmentService";
import { DoctorProfile } from "../models/DoctorProfile";


class AppointmentController {
  async createAppointment(req: Request, res: Response) {
    try {
      const patientId = req.user!.id;
      const { doctor, appointmentDate, timeSlot, notes } = req.body;

      console.log("BOOK APPOINTMENT BODY:", req.body);
      console.log("DOCTOR RECEIVED:", doctor);

      if (!doctor) {
        return res.status(400).json({
          success: false,
          message: "Doctor is required",
        });
      }

      const appointment = await appointmentService.createAppointment({
        patient: patientId,
        doctor,
        appointmentDate: new Date(appointmentDate),
        timeSlot,
        notes,
      });

      return res.status(201).json({
        success: true,
        message: "Appointment booked successfully",
        appointment,
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message: error.message || "Failed to create appointment",
      });
    }
  }

  async getAppointments(req: Request, res: Response) {
    try {
      const patientId = req.user!.id;
      const { status, date } = req.query;

      const appointments = await appointmentService.getPatientAppointments(patientId, {
        status: status as string,
        date: date as string,
      });

      return res.status(200).json({
        success: true,
        count: appointments.length,
        appointments,
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message: error.message || "Failed to fetch appointments",
      });
    }
  }

  async getDoctorAppointments(req: Request, res: Response) {
    try {
      const doctorProfile = await DoctorProfile.findOne({ user: req.user!.id });

      if (!doctorProfile) {
        return res.status(404).json({
          success: false,
          message: "Doctor profile not found.",
        });
      }

      const { status, date } = req.query;

      const appointments = await appointmentService.getDoctorAppointments(
        doctorProfile._id.toString(),
        {
          status: status as string | undefined,
          date: date as string | undefined,
        }
      );

      return res.status(200).json({
        success: true,
        count: appointments.length,
        appointments,
      });
    } catch (error: any) {
      console.error("Get doctor appointments error:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to fetch doctor appointments.",
        error: error.message,
      });
    }
  }

  async getAvailableTimeSlots(req: Request, res: Response) {
    try {
      const { doctor, date } = req.query;

      if (!doctor || !date) {
        return res.status(400).json({
          success: false,
          message: "Doctor and date are required",
        });
      }

      const appointmentDate = new Date(date as string);

      if (isNaN(appointmentDate.getTime())) {
        return res.status(400).json({
          success: false,
          message: "Invalid date",
        });
      }

      const availableSlots =
        await appointmentService.getAvailableTimeSlots(
          doctor as string,
          appointmentDate
        );

      return res.status(200).json({
        success: true,
        date,
        doctor,
        count: availableSlots.length,
        availableTimeSlots: availableSlots,
      });
    } catch (error: any) {
      console.error("Get available time slots error:", error);

      return res.status(500).json({
        success: false,
        message:
          error.message || "Failed to fetch available time slots",
      });
    }
  }

  // async cancelAppointment(req: Request, res: Response) {
  //   try {
  //     const appointmentId = req.params.id as string;
  //     const userId = req.user!.id;
  //     const role = req.user!.role;

  //     const appointment = await appointmentService.cancelAppointment(appointmentId, userId, role);

  //     return res.status(200).json({
  //       success: true,
  //       message: "Appointment cancelled successfully",
  //       appointment,
  //     });
  //   } catch (error: any) {
  //     return res.status(400).json({
  //       success: false,
  //       message: error.message || "Failed to cancel appointment",
  //     });
  //   }
  // }

  async cancelAppointment(req: Request, res: Response) {
    try {
      const appointmentId = req.params.id as string;
      const userId = req.user!.id;
      const role = req.user!.role;

      let ownerId = userId;

      // Appointment.doctor stores DoctorProfile._id,
      // while req.user.id is User._id.
      if (role === "doctor") {
        const doctorProfile = await DoctorProfile.findOne({
          user: userId,
        });

        if (!doctorProfile) {
          return res.status(404).json({
            success: false,
            message: "Doctor profile not found.",
          });
        }

        ownerId = doctorProfile._id.toString();
      }

      const appointment = await appointmentService.cancelAppointment(
        appointmentId,
        ownerId,
        role
      );

      return res.status(200).json({
        success: true,
        message: "Appointment cancelled successfully",
        appointment,
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message: error.message || "Failed to cancel appointment",
      });
    }
  }

  async confirmAppointment(req: Request, res: Response) {
    try {
      const appointmentId = req.params.id as string;

      const doctorProfile = await DoctorProfile.findOne({ user: req.user!.id });
      if (!doctorProfile) {
        return res.status(404).json({
          success: false,
          message: "Doctor profile not found.",
        });
      }

      const appointment = await appointmentService.confirmAppointment(
        appointmentId,
        doctorProfile._id.toString()
      );

      return res.status(200).json({
        success: true,
        message: "Appointment confirmed successfully",
        appointment,
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message: error.message || "Failed to confirm appointment",
      });
    }
  }

  async completeAppointment(req: Request, res: Response) {
    try {
      const appointmentId = req.params.id as string;

      const doctorProfile = await DoctorProfile.findOne({ user: req.user!.id });
      if (!doctorProfile) {
        return res.status(404).json({
          success: false,
          message: "Doctor profile not found.",
        });
      }

      const appointment = await appointmentService.completeAppointment(
        appointmentId,
        doctorProfile._id.toString()
      );

      return res.status(200).json({
        success: true,
        message: "Appointment completed successfully",
        appointment,
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message: error.message || "Failed to complete appointment",
      });
    }
  }
}

export default new AppointmentController();