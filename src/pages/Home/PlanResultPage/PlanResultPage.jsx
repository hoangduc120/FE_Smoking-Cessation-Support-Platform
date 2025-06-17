"use client"

import { useSearchParams } from "next/navigation"
import { Suspense } from "react"
import { Box, Button, Card, CardContent, Typography, CircularProgress } from "@mui/material"
import { motion } from "framer-motion"
import Link from "next/link"
import { Cancel } from "@mui/icons-material"
import SuccessPlanResult from "./SuccessPlanResult"
import FailedPlanResult from "./FailedPlanResult"

export default function PlanResultPage() {
  const searchParams = useSearchParams()
  const status = searchParams.get("status") || "unknown"
  const planId = searchParams.get("planId") || ""

  if (status === "unknown") {
    return (
      <Box className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
        <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-md">
          <Card className="bg-white/10 backdrop-blur-lg border-white/20 shadow-2xl">
            <CardContent className="p-8 text-center">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
              >
                <Cancel className="h-20 w-20 text-red-400 mx-auto mb-6" />
              </motion.div>
              <Typography variant="h5" className="text-2xl font-bold text-white mb-4">
                Không tìm thấy kết quả
              </Typography>
              <Typography className="text-gray-300 mb-6">
                Vui lòng truy cập với URL hợp lệ
              </Typography>
              <Link href="/member/dashboard">
                <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                  <ArrowBack className="h-4 w-4 mr-2" />
                  Về Dashboard
                </Button>
              </Link>
            </CardContent>
          </Card>
        </motion.div>
      </Box>
    )
  }

  return (
    <Suspense
      fallback={
        <Box className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
          <Box className="text-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
              className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full mx-auto mb-4"
            />
            <Typography className="text-xl text-gray-600">Đang tải kết quả tuyệt vời...</Typography>
          </Box>
        </Box>
      }
    >
      {status === "success" ? (
        <SuccessPlanResult planId={planId} />
      ) : (
        <FailedPlanResult planId={planId} />
      )}
    </Suspense>
  )
}